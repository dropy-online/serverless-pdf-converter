import { S3 } from 'aws-sdk';
import { PageObject, ConvertResult, S3Errors, S3Object } from '@/types';

export class S3Client {
  client: S3;

  constructor() {
    this.client = new S3();
  }

  async getObject(Bucket: string, Key: string): Promise<S3Object> {
    const params: S3.GetObjectRequest = {
      Bucket,
      Key,
    };
    try {
      const { ContentType, Body } = await this.client.getObject(params).promise();
      return { ContentType, Body };
    } catch (e) {
      throw JSON.stringify({ code: S3Errors.FAILED_S3_GET_OBJECT, message: e });
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
      throw JSON.stringify({ code: S3Errors.FAILED_S3_PUT_OBJECT, message: e });
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
      throw JSON.stringify({ code: S3Errors.FAILED_S3_DELETE_OBJECT, message: e });
    }
  }

  async emptyBucket(Bucket: string, Prefix: string): Promise<void> {
    const params: S3.ListObjectsV2Request = {
      Bucket,
      Prefix,
    };
    const data = await this.client.listObjectsV2(params).promise();
    const keys = data.Contents.map((content) => content.Key);
    const deletes = keys.map(
      (key) =>
        new Promise((resolve, reject) => {
          this.deleteObject(Bucket, key)
            .then((deleteData) => resolve(deleteData))
            .catch((err) => reject(err));
        })
    );
    await Promise.all(deletes);
  }

  async uploadObjects(
    array: PageObject[],
    Bucket: string,
    prefix: string | undefined,
    format: string
  ): Promise<ConvertResult[]> {
    const uploads = array.flat().map((item) => {
      const Key = `${prefix ? prefix + '/' : ''}${item.page}.${format}`;
      return new Promise<ConvertResult>((resolve, reject) => {
        this.putObject(item.body, { Bucket, Key, ACL: 'public-read' })
          .then(() => resolve({ page: item.page, url: Key }))
          .catch((err) => reject(err));
      });
    });
    const result = await Promise.all(uploads);
    return result;
  }
}
