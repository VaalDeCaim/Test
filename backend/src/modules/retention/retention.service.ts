import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Job } from '../../entities/job.entity';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {}

  @Cron('0 3 * * *') // Daily at 3:00 AM
  async purgeExpiredFiles(): Promise<void> {
    if (this.config.get<string>('RETENTION_DISABLED') === 'true') return;

    const hours = parseInt(
      this.config.get<string>('RETENTION_HOURS', '72'),
      10,
    );
    if (hours <= 0) return;

    const client = this.storage.getClient();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    const jobs = await this.jobRepo.find({
      where: { createdAt: LessThan(cutoff) },
      select: ['id', 'rawKey', 'exportKeyCsv', 'exportKeyXlsx', 'exportKeyQbo'],
    });

    const rawBucket = this.storage.getRawBucket();
    const exportsBucket = this.storage.getExportsBucket();
    let deleted = 0;

    for (const job of jobs) {
      try {
        if (job.rawKey) {
          await client.send(
            new DeleteObjectCommand({
              Bucket: rawBucket,
              Key: job.rawKey,
            }),
          );
          deleted++;
        }
        for (const key of [
          job.exportKeyCsv,
          job.exportKeyXlsx,
          job.exportKeyQbo,
        ]) {
          if (key) {
            await client.send(
              new DeleteObjectCommand({
                Bucket: exportsBucket,
                Key: key,
              }),
            );
            deleted++;
          }
        }
      } catch {
        this.logger.warn(`Failed to delete files for job ${job.id}`);
      }
    }

    if (deleted > 0) {
      this.logger.log(
        `Purged ${deleted} files from ${jobs.length} expired jobs`,
      );
    }
  }
}
