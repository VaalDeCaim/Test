import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { InitUploadDto } from './dto/init-upload.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadsService {
  constructor(private readonly storage: StorageService) {}

  async initUpload(
    dto: InitUploadDto,
  ): Promise<{ uploadUrl: string; key: string }> {
    const allowedExt = ['.mt940', '.xml', '.camt053'];
    const ext = dto.filename.includes('.')
      ? dto.filename.slice(dto.filename.lastIndexOf('.')).toLowerCase()
      : '';
    const safeExt = allowedExt.includes(ext) ? ext : '.mt940';
    const key = `uploads/${randomUUID()}${safeExt}`;

    const uploadUrl = await this.storage.getPresignedPutUrl(
      key,
      dto.contentType || 'application/octet-stream',
    );

    return { uploadUrl, key };
  }
}
