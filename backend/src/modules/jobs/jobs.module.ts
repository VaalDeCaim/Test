import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../../entities/job.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { StorageModule } from '../storage/storage.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), StorageModule, BillingModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
