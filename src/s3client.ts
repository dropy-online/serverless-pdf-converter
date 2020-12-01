import { S3 } from 'aws-sdk';
import { S3Errors } from '@/types';

export class S3Client {
  client: S3

  constructor() {
    this.client = new S3();
  }

  async getObject(Bucket: string, Key: string): Promise<S3.Body> {
    const params: S3.GetObjectRequest = {
      Bucket,
      Key,
    };
    try {
      const response = await this.client.getObject(params).promise();
      return response.Body;
    } catch (e) {
      throw S3Errors.FAILED_S3_GET_OBJECT;
    }
  }

  async putObject(file: S3.Body, params: S3.PutObjectRequest): Promise<S3.PutObjectOutput> {
    try {
      return await this.client.putObject({
        ...params,
        Body: file,
      }).promise();
    } catch (e) {
      throw S3Errors.FAILED_S3_PUT_OBJECT;
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
      throw S3Errors.FAILED_S3_DELETE_OBJECT;
    }
  }

  async emptyBucket(Bucket: string, Prefix: string): Promise<void> {
    const params: S3.ListObjectsV2Request = {
      Bucket,
      Prefix,
    };
    const data = await this.client.listObjectsV2(params).promise();
    const keys = data.Contents.map((content) => content.Key);
    const deletes = keys.map((key) =>
      new Promise((resolve, reject) => {
        this.deleteObject(Bucket, key)
          .then((deleteData) => resolve(deleteData))
          .catch((err) => reject(err));
      }));
    await Promise.all(deletes);
  }

  async uploadObjects(
    array: Buffer[][],
    Bucket: string,
    prefix: string,
    format: string,
  ): Promise<void> {
    const uploads = array.flat().map((item, idx) => {
      const Key = `${prefix}/${idx}.${format}`;
      return new Promise((resolve, reject) => {
        this.putObject(item, { Bucket, Key })
          .then(() => resolve(Key))
          .catch((err) => reject(err));
      });
    });
    await Promise.all(uploads);
  }
}
