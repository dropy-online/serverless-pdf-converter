import { S3 } from 'aws-sdk';
import { S3Errors } from '@/types';

export class S3Client {
  client: S3

  constructor() {
    this.client = new S3();
  }

  async getObject(Bucket: string, Key: string): Promise<S3.GetObjectOutput> {
    const params: S3.GetObjectRequest = {
      Bucket,
      Key,
    };
    try {
      return await this.client.getObject(params).promise();
    } catch (e) {
      throw new Error(S3Errors.FAILED_S3_GET_OBJECT);
    }
  }

  async putObject(file: S3.Body, params: S3.PutObjectRequest):Promise<S3.PutObjectOutput> {
    try {
      return await this.client.putObject({
        ...params,
        Body: file,
      }).promise();
    } catch (e) {
      throw new Error(S3Errors.FAILED_S3_PUT_OBJECT);
    }
  }

  async deleteObject(Bucket: string, Key: string): Promise<S3.DeleteObjectOutput> {
    const params: S3.DeleteObjectRequest = {
      Bucket,
      Key,
    };
    try {
      return await this.client.deleteObject(params).promise();
    } catch (e) {
      throw new Error(S3Errors.FAILED_S3_DELETE_OBJECT);
    }
  }
}
