import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus, JobFormat } from '../../entities/job.entity';
import { StorageService } from '../storage/storage.service';
import { BillingService } from '../billing/billing.service';
import { CreateJobDto } from './dto/create-job.dto';

const COINS_PER_JOB = 1;
import { Camt053Parser } from '../../parsers/camt053.parser';
import { Mt940Parser } from '../../parsers/mt940.parser';
import { detectFormat } from '../../parsers/format-detector';
import type { ParseResult } from '../../parsers/transaction.model';
import { exportToCsv } from '../../exporters/csv.exporter';
import { exportToXlsx } from '../../exporters/xlsx.exporter';
import { exportToQbo } from '../../exporters/qbo.exporter';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { CoinTransactionType } from '../../entities/coin-transaction.entity';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly camtParser = new Camt053Parser();
  private readonly mt940Parser = new Mt940Parser();

  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    private readonly storage: StorageService,
    private readonly billing: BillingService,
  ) {}

  async create(userId: string, dto: CreateJobDto): Promise<Job> {
    const hasPro = await this.billing.hasProAccess(userId);
    if (!hasPro) {
      const balance = await this.billing.getBalance(userId);
      if (balance < COINS_PER_JOB) {
        throw new ForbiddenException(
          'Insufficient coins. Top up your balance or subscribe to Pro.',
        );
      }
    }

    const job = this.jobRepo.create({
      userId,
      rawKey: dto.key,
      originalFilename: dto.originalFilename ?? null,
      status: JobStatus.PENDING,
    });
    await this.jobRepo.save(job);

    if (!hasPro) {
      await this.billing.deductCoins(userId, COINS_PER_JOB, job.id);
    }

    this.processJob(job.id, !hasPro).catch(() => {
      this.logger.warn(`Job ${job.id} failed`, { jobId: job.id });
    });

    return job;
  }

  async findOne(id: string, userId: string): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id, userId } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async findAll(userId: string): Promise<Job[]> {
    return this.jobRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async processJob(jobId: string, refundOnFailure = false): Promise<void> {
    const job = await this.jobRepo.findOne({ where: { id: jobId } });
    if (!job || job.status !== JobStatus.PENDING) return;

    await this.jobRepo.update(jobId, { status: JobStatus.PROCESSING });

    let parseResult: ParseResult | null = null;

    try {
      const content = await this.fetchFileContent(job.rawKey);
      const format = detectFormat(content);

      await this.jobRepo.update(jobId, { format });

      parseResult =
        format === JobFormat.CAMT053
          ? this.camtParser.parse(content)
          : this.mt940Parser.parse(content);

      if (
        parseResult.errors.length > 0 &&
        parseResult.transactions.length === 0
      ) {
        throw new Error(parseResult.errors.join('; '));
      }

      const { transactions } = parseResult;

      const baseKey = `exports/${jobId}`;

      const csvContent = exportToCsv(transactions);
      await this.uploadExport(baseKey + '.csv', csvContent, 'text/csv');

      const xlsxBuffer = await exportToXlsx(transactions);
      await this.uploadExport(
        baseKey + '.xlsx',
        xlsxBuffer,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      const qboContent = exportToQbo(transactions);
      await this.uploadExport(baseKey + '.qbo', qboContent, 'text/plain');

      await this.jobRepo.update(jobId, {
        status: JobStatus.COMPLETED,
        exportKeyCsv: baseKey + '.csv',
        exportKeyXlsx: baseKey + '.xlsx',
        exportKeyQbo: baseKey + '.qbo',
        errorMessage: null,
        validationErrors: parseResult.errors,
        validationWarnings: parseResult.warnings,
      });
    } catch (err) {
      const errorMsg = (err as Error).message;
      await this.jobRepo.update(jobId, {
        status: JobStatus.FAILED,
        errorMessage: errorMsg,
        validationErrors: parseResult?.errors ?? [],
        validationWarnings: parseResult?.warnings ?? [],
      });
      if (refundOnFailure) {
        await this.billing.addCoins(
          job.userId,
          COINS_PER_JOB,
          CoinTransactionType.REFUND,
          undefined,
          jobId,
        );
      }
    }
  }

  private async fetchFileContent(key: string): Promise<string> {
    const client = this.storage.getClient();
    const bucket = this.storage.getRawBucket();
    const res = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const body = res.Body;
    if (!body) throw new Error('Empty file');
    const buf = await body.transformToByteArray();
    return new TextDecoder().decode(buf);
  }

  private async uploadExport(
    key: string,
    content: string | Buffer,
    contentType: string,
  ): Promise<void> {
    const client = this.storage.getClient();
    const bucket = this.storage.getExportsBucket();
    const body =
      typeof content === 'string' ? Buffer.from(content, 'utf-8') : content;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }
}
