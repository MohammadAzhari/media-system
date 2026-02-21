import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join, dirname } from 'path';
import { renameSync } from 'fs';

@Controller('upload')
export class UploadController {
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = extname(originalName);
    const baseName = originalName.replace(extension, '');
    const newName = `${timestamp}_${baseName}${extension}`;

    // Rename the file on disk
    const oldPath = file.path;
    const newPath = join(dirname(oldPath), newName);
    renameSync(oldPath, newPath);

    // Update the file object
    file.filename = newName;
    file.path = newPath;

    return {
      message: 'File uploaded successfully',
      filename: newName,
    };
  }
}
