import * as multer from 'multer';
import fs from 'fs';
import path from 'path';
import { MulterModuleOptions as MMO } from '@nestjs/platform-express';
import { FileValidator } from '@nestjs/common';
import type { Express } from 'express';
import { ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '/uploads/products');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

export const MulterModuleOptions: MMO = {
  storage
};

export class ImageTypeValidator extends FileValidator<{ types: string[] }> {
  constructor(
    protected override validationOptions: { types: string[] }
  ) {
    super(validationOptions);
  }

  isValid(file: Express.Multer.File): boolean {
    return this.validationOptions.types.includes(file.mimetype);
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `Unsupported file type ${file.mimetype}. Allowed types: ${this.validationOptions.types.join(', ')}`;
  }
}

export const ImageUploadPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 2097152 // 2MB
    }),
    new ImageTypeValidator({
      types: ['image/jpeg', 'image/png', 'image/webp']
    })
  ]
});
