# serverless-pdf-converter

## Description

This serverless application deploys [API Gateway](https://aws.amazon.com/api-gateway/) and [Lambda functions](https://aws.amazon.com/lambda/) to your AWS account. It reads a PDF file from your S3 bucket and splits it into several page groups to invoke converting functions in parallel. Converting function processes images and uploads them to your S3 bucket. The data of uploaded images are served through API Gateway.

### Why split pages and invoke functions

Because of the way [ImageMagick](https://imagemagick.org/index.php) works, If your command asks for the entire PDF document, it will all be converted in memory before any images are written. Thus, depends on the size of your PDF: the number of pages, and the pixels per page, It needs more memory and time to complete processing than you have available.

## Usage

### Prerequisites

This application is built with [serverless framework](https://github.com/serverless/serverless).

- Install serverless framework open-source CLI. More details read [this](https://www.serverless.com/framework/docs/providers/aws/guide/quick-start/).

```shell
$ npm i -g serverless
```

- Create AWS IAM user and access key on your AWS account. More details read [this](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).
  - recommend choosing AdministratorAccess in existing policies
- Setup AWS credential with serverless command. More details read [this](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)

```shell
$ serverless config credentials --provider aws --key xxx --secret xxx
```

### Deploy layers on your AWS lambda

Since ImageMagick lambda layer does not include Ghostscript, you need to deploy both layers.

- [Ghostscript Lambda Layer version 1](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:154387959412:applications~ghostscript-lambda-layer)
- [ImageMagick Lambda Layer version 1](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:145266761615:applications~image-magick-lambda-layer)

### Clone this repository and Update serverless configuration

```typescript
/* serverless.ts */

provider: {
    /* Required. Your AWS region */
    region: 'xxx',
    environment: {
      /* Required. Your public s3 bucket name */
      BUCKET: 'xxx',
      /* Optional. You can change default query options */
      DEFAULT_OPTIONS: JSON.stringify({
        format: 'png',
        size: null,
        quality: null,
        density: null,
        division: 3,
        pathname: 'images',
      }),
    },
  },

functions: {
    convert: {
      /* Optional. You can change memory size of converting function */
      memorySize: 1024,
      /* Required. Your lambda layer ARN */
      layers: [
        'arn:aws:lambda:ap-northeast-2:xxx:layer:ghostscript:1',
        'arn:aws:lambda:ap-northeast-2:xxx:layer:image-magick:1',
      ],
    },
  },
```

_Note: Check [AWS Lambda pricing](https://aws.amazon.com/lambda/pricing/) when you set the memory size._

### Local test

```
yarn install
yarn start
```

You can query some tests on `http://localhost:3000` via [serverless-offline](https://github.com/dherault/serverless-offline). Be sure ImageMagick is installed on your computer.

### Deploy serverless application

```
yarn deploy
```

You can get the endpoint url like `https://xxxxx.execute-api.ap-northeast-2.amazonaws.com/production/v1/convert`.

## Query Parameters

| Name     | Type   | Required | Description                                                                                                                               |
| -------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| key      | String | true     | The **encoded** object key of PDF file in your S3 bucket.                                                                                 |
| format   | String | false    | Image format. ([Available format](http://imagemagick.sourceforge.net/http/www/formats.html))<br />Default is 'png'.                       |
| pathname | String | false    | The S3 path where images are saved. If you put nothing, images are saved at the same level as your PDF resource.<br/>Default is 'images'. |
| division | Number | false    | The number of pages to process by one converting function. If you put 0, there will be no division.<br />Default is 3.                    |
| size     | Number | false    | The width of image. ([resize](https://imagemagick.org/script/command-line-options.php#resize))<br />Default is original size.             |
| quality  | Number | false    | The quality of image. ([quality](https://imagemagick.org/script/command-line-options.php#quality))<br />Default is 85.                    |
| density  | Number | false    | The densitiy of image. ([density](https://imagemagick.org/script/command-line-options.php#density))<br />Default is 72dpi.                |

## Success Response

```typescript
export type SuccessResponseBody = {
  status: 'succeded';
  data: {
    /* Page number of uploaded image */
    page: number;
    /* Object key of uploaded image */
    url: string;
  }[];
};
```

## Error Response

```typescript
export type ErrorResponseBody = {
  status: 'error';
  error: {
    code: string;
    message?: Error | string;
  };
};
```

### Error Code

```
- UNDEFINED_QUERY_PARAMS : missing 'key' query string parameter.
- UNDEFINED_FILE_TYPE : missing content type of S3 Object
- UNSUPPORTED_FILE_TYPE : request with non-pdf file
- FAILED_S3_GET_OBJECT : fail to get the object from S3 bucket
- FAILED_S3_PUT_OBJECTL : fail to put the object from S3 bucket
- FAILED_S3_DELETE_OBJECT : fail to delete the object from S3 bucket
- UNDEFINED_CONVERT_PAYLOAD : missing data to process image
- FAILED_PARSE_PDF : fail to parse PDF with pdf-parse
- FAILED_CONVERT_PAGE : fail to process image with ImageMagick
```

## Note

- Basically, S3 path where images are saved will be deleted when an error is occurred during converting process.
- API Gateway times out after 30 seconds, and as of now, it is not configurable. Depending on the requested file size, you might get a timeout message. In this case, however, the lambda function continues converting process.
