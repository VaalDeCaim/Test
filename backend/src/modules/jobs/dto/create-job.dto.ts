import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({
    description: 'S3 key of the uploaded file (uploads/<uuid>.<ext>)',
  })
  @IsString()
  @Matches(/^uploads\/[0-9a-f-]{36}\.(mt940|xml|camt053)$/i, {
    message: 'key must match uploads/<uuid>.(mt940|xml|camt053)',
  })
  key: string;

  @ApiPropertyOptional({ description: 'Original filename' })
  @IsOptional()
  @IsString()
  originalFilename?: string;
}
