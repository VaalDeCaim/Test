import { IsOptional, IsUrl, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopUpDto {
  @ApiProperty({ enum: ['small', 'medium', 'large'] })
  @IsIn(['small', 'medium', 'large'])
  packageId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  successUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  cancelUrl?: string;
}
