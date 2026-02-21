import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '../models/content.model'

export class CreateContentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  @IsNotEmpty()
  mediaType!: MediaType;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  mediaUrl!: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  externalMetadata?: Record<string, unknown>;
}
