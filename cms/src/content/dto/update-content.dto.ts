import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  mediaType?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  processingStatus?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
