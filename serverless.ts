import type { AWS } from '@serverless/typescript';

/* eslint-disable no-template-curly-in-string */
const serverlessConfiguration: AWS = {
  service: 'serverless-pdf-converter',
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
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      BUCKET: 'your bucket',
      REGION: '${self:provider.region}',
      STAGE: '${self:provider.stage}',
      CONVERT_MEMORY_SIZE: '${self:functions.convert.memorySize}',
      CONVERT_FUNCTION_NAME: '${self:service.name}-${self:provider.stage}-convert',
      DEFAULT_OPTIONS: JSON.stringify({
        format: 'png',
        size: null,
        quality: 100,
        density: null,
        division: 3,
        pathname: 'images',
      }),
    },
    iam: {
      role: {
        statements: [
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
    },
    lambdaHashingVersion: '20201221',
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
      memorySize: 1024,
      timeout: 900,
      handler: 'src/convert.handler',
      layers: ['your ghostscript layer arn', 'your imagemagick layer arn'],
    },
  },
};

module.exports = serverlessConfiguration;
