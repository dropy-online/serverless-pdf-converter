import { S3 } from 'aws-sdk';
import { createError, createObjectKey } from '@/utils';
import { ConvertResult, S3Errors, S3Object } from '@/types';

export class S3Client {
  private client: S3;

  private Bucket: string;

  constructor(bucket: string) {
    this.client = new S3();
    this.Bucket = bucket;
  }

  async getObject(Key: string): Promise<S3Object> {
    const params: S3.GetObjectRequest = {
      Bucket: this.Bucket,
      Key,
    };
    try {
      const { ContentType, Body } = await this.client.getObject(params).promise();
      return { ContentType, Body };
    } catch (e) {
      throw createError({ code: S3Errors.FAILED_S3_GET_OBJECT, message: e });
    }
  }

  async putObject(file: S3.Body, params: S3.PutObjectRequest): Promise<S3.PutObjectOutput> {
    try {
      return await this.client
        .putObject({
          ...params,
          Body: file,
        })
        .promise();
    } catch (e) {
      throw createError({ code: S3Errors.FAILED_S3_PUT_OBJECT, message: e });
    }
  }

  async deleteObject(Key: string): Promise<S3.DeleteObjectOutput> {
    const params: S3.DeleteObjectRequest = {
      Bucket: this.Bucket,
      Key,
    };
    try {
      return await this.client.deleteObject(params).promise();
    } catch (e) {
      throw createError({ code: S3Errors.FAILED_S3_DELETE_OBJECT, message: e });
    }
  }

  async emptyBucket(Prefix: string | undefined): Promise<void> {
    const params: S3.ListObjectsV2Request = {
      Bucket: this.Bucket,
      Prefix,
    };
    const data = await this.client.listObjectsV2(params).promise();
    const keys = data.Contents.map((content) => content.Key);
    const deletes = keys.map(
      (key) =>
        new Promise((resolve, reject) => {
          this.deleteObject(key)
            .then((deleteData) => resolve(deleteData))
            .catch((err) => reject(err));
        })
    );
    await Promise.all(deletes);
  }

  async uploadObject(
    image: Buffer,
    page: number,
    prefix: string | undefined,
    format: string
  ): Promise<ConvertResult> {
    const Key = createObjectKey(prefix, page, format);
    await this.putObject(image, { Bucket: this.Bucket, Key, ACL: 'public-read' });
    return { page, url: Key };
  }
}
