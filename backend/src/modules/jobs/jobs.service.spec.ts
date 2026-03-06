import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { Job, JobStatus } from '../../entities/job.entity';
import { StorageService } from '../storage/storage.service';
import { BillingService } from '../billing/billing.service';
import { CreateJobDto } from './dto/create-job.dto';

const mockJobRepo = {
  create: jest.fn((dto: object) => ({ ...dto, id: 'job-123' })),
  save: jest.fn((job: object) => Promise.resolve({ ...job, id: 'job-123' })),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
};

const mockStorageService = {
  getClient: jest.fn(),
  getRawBucket: jest.fn().mockReturnValue('raw'),
  getExportsBucket: jest.fn().mockReturnValue('exports'),
};

const mockBillingService = {
  hasProAccess: jest.fn().mockResolvedValue(false),
  getBalance: jest.fn().mockResolvedValue(10),
  deductCoins: jest.fn().mockResolvedValue(undefined),
};

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockJobRepo.findOne.mockResolvedValue(null);
    mockJobRepo.find.mockResolvedValue([]);
    mockBillingService.hasProAccess.mockResolvedValue(false);
    mockBillingService.getBalance.mockResolvedValue(10);
    mockBillingService.deductCoins.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: getRepositoryToken(Job), useValue: mockJobRepo },
        { provide: StorageService, useValue: mockStorageService },
        { provide: BillingService, useValue: mockBillingService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  describe('create', () => {
    it('should create and return a job (deducts coins when not Pro)', async () => {
      const dto: CreateJobDto = {
        key: 'uploads/550e8400-e29b-41d4-a716-446655440000.mt940',
      };
      const result = await service.create('user-1', dto);
      expect(result.id).toBe('job-123');
      expect(mockBillingService.deductCoins).toHaveBeenCalledWith(
        'user-1',
        1,
        expect.any(String),
      );
      expect(mockJobRepo.save).toHaveBeenCalled();
    });

    it('should not deduct coins when user has Pro', async () => {
      mockBillingService.hasProAccess.mockResolvedValue(true);
      const dto: CreateJobDto = {
        key: 'uploads/550e8400-e29b-41d4-a716-446655440000.mt940',
      };
      await service.create('user-1', dto);
      expect(mockBillingService.deductCoins).not.toHaveBeenCalled();
    });

    it('should throw when insufficient coins', async () => {
      mockBillingService.getBalance.mockResolvedValue(0);
      const dto: CreateJobDto = {
        key: 'uploads/550e8400-e29b-41d4-a716-446655440000.mt940',
      };
      await expect(service.create('user-1', dto)).rejects.toThrow(
        'Insufficient coins',
      );
    });
  });

  describe('findOne', () => {
    it('should return job when found', async () => {
      const job = {
        id: 'job-1',
        userId: 'user-1',
        status: JobStatus.COMPLETED,
      };
      mockJobRepo.findOne.mockResolvedValue(job);
      const result = await service.findOne('job-1', 'user-1');
      expect(result).toEqual(job);
    });

    it('should throw NotFoundException when job not found', async () => {
      mockJobRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('job-1', 'user-1')).rejects.toThrow(
        'Job not found',
      );
    });
  });

  describe('findAll', () => {
    it('should return user jobs', async () => {
      const jobs = [{ id: 'job-1', userId: 'user-1' }];
      mockJobRepo.find.mockResolvedValue(jobs);
      const result = await service.findAll('user-1');
      expect(result).toEqual(jobs);
      expect(mockJobRepo.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
