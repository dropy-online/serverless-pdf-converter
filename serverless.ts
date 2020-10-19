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
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'ap-northeast-2',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_ENV: 'dev',
      BUCKET: '',
    },
  },
  functions: {
    hello: {
      handler: 'src/index.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/{proxy}',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
