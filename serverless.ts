import type { Serverless } from 'serverless/aws';

/* eslint-disable no-template-curly-in-string */
const serverlessConfiguration: Serverless = {
  service: {
    name: 'dropy-lambda-layer',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs10.x',
    region: 'ap-northeast-2',
    stage: "${opt:stage, 'dev'}",
    environment: {
      BUCKET: 'dropy',
      REGION: '${self:provider.region}',
      STAGE: '${self:provider.stage}',
      PARALLEL_EXEC_OFFSET: 3,
      PARALLEL_FUNCTION_NAME: '${self:service.name}-${self:provider.stage}-convert',
      CONFIG: JSON.stringify({
        maxSize: 1204,
        minSize: 10,
        maxQuality: 200,
        minQuality: 10,
      }),
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::*',
      },
      {
        Effect: 'Allow',
        Action: ['lambda:InvokeFunction', 'lambda:InvokeAsync'],
        Resource: '*',
      },
    ],
  },
  functions: {
    endpoint: {
      memorySize: 1024,
      timeout: 30,
      handler: 'src/index.handler',
      events: [
        {
          http: {
            method: 'get',
            cors: true,
            path: '/v1/convert',
            request: {
              parameters: {
                querystrings: {
                  key: true,
                  format: true,
                  size: true,
                  quality: true,
                },
              },
            },
          },
        },
      ],
    },
    convert: {
      memorySize: 2048,
      timeout: 900,
      handler: 'src/convert.handler',
      layers: [
        'arn:aws:lambda:ap-northeast-2:073744365895:layer:ghostscript:1',
        'arn:aws:lambda:ap-northeast-2:073744365895:layer:image-magick:1',
      ],
    },
  },
};

module.exports = serverlessConfiguration;
