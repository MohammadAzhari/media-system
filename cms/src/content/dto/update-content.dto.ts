import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '../models/content.model'

export class UpdateContentDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: MediaType })
  @IsOptional()
  @IsString()
  mediaType?: MediaType;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  mediaUrl?: string;
}

export class MarkAsProcessedDto {
  @ApiProperty({ type: Object })
  @IsObject()
  processingMetadata: Record<string, unknown>;
}