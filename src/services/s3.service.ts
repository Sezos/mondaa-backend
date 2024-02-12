import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    region: process.env.AWS_S3_REGION,
  });

  async uploadFile(folder: string, base64image: string) {
    const buffer = Buffer.from(
      base64image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const rand = Math.floor(Math.random() * 1000 + 100);
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(`${folder}/${Date.now()}${rand}.jpeg`),
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return {
        success: true,
        message: 'Амжилттай.',
        response: s3Response,
      };
    } catch (e) {
      throw Error('Алдаа гарлаа. Зураг Оруулж чадсангүй');
    }
  }

  async uploadXLSX(buffer: any, name: string) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(`xlsx/${name}`),
      Body: buffer,
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return {
        success: true,
        message: 'Амжилттай.',
        response: s3Response.Location,
      };
    } catch (e) {
      return {
        success: false,
        message: 'Алдаа гарлаа.',
        error: e,
      };
    }
  }

  async deleteFile(key) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: key,
    };
    const s3Response = await this.s3.deleteObject(params).promise();
    console.log('deleteFile: ', s3Response);
  }
}
