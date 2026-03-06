import { IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProCheckoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  successUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  cancelUrl?: string;
}
