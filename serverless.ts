import type { Serverless } from 'serverless/aws';

/* eslint-disable no-template-curly-in-string */
const serverlessConfiguration: Serverless = {
  service: {
    name: 'serverless-pdf-converter',
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
    region: "${opt:region, 'ap-northeast-2'}",
    stage: "${opt:stage, 'dev'}",
    environment: {
      BUCKET: 'dropy',
      REGION: '${self:provider.region}',
      STAGE: '${self:provider.stage}',
      CONVERT_MEMORY_SIZE: 2048,
      CONVERT_FUNCTION_NAME: '${self:service.name}-${self:provider.stage}-convert',
      DEFAULT_OPTIONS: JSON.stringify({
        format: 'png',
        size: null,
        quality: 100,
        density: 200,
        division: 3,
        pathname: 'images',
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
                  division: true,
                  pathname: true,
                },
              },
            },
          },
        },
      ],
    },
    convert: {
      memorySize: process.env.CONVERT_MEMORY_SIZE,
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
