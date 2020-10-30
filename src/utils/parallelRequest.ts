import aws from 'aws-sdk';

const lambdaConfig = {
  apiVersion: '2031',
  endpoint: process.env.NODE_ENV === 'dev' ? 'http://localhost:3002' : 'TODO',
};

const lambdaParams = {
  InvocationType: 'Event',
};

export const parallelRequest = async<TItems extends any[], TParams>
(FunctionName: string, items: TItems, params : TParams): Promise<any[]> => {
  const lambda = new aws.Lambda(lambdaConfig);
  const requests = items.map((item) => new Promise((resolve, reject) =>
    lambda.invoke({ ...lambdaParams, FunctionName, Payload: JSON.stringify({ item, params }) },
      (error, data) => (error ? reject(error) : resolve(data.Payload)))));
  const result = await Promise.all(requests);
  return result;
};
