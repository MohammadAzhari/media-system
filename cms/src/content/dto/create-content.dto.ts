import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  mediaType!: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  mediaUrl!: string;

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
