import type { Serverless } from 'serverless/aws';

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
    stage: process.env.NODE_ENV || 'development',
    region: 'ap-northeast-2',
    environment: {
      REGION: 'ap-northeast-2',
      BUCKET: 'dropy',
      PARALLEL_EXEC_OFFSET: 3,
      PARALLEL_FUNCTION_NAME: 'dropy-lambda-layer-dev-convert',
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
        Action: ['s3:GetObject', 's3:PutObject'],
        Resource: `arn:aws:s3:::${process.env.BUKET}/*`,
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
      handler: 'src/convert.handler',
    },
  },
};

module.exports = serverlessConfiguration;
