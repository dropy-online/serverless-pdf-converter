import aws from 'aws-sdk';

const lambda = new aws.Lambda({
  apiVersion: '2031',
  endpoint: 'http://localhost:3002',
});

const lambdaParams = {
  InvocationType: 'Event',
};

export const parallelRequest = async<TPayloads, TParams>
(FunctionName: string, payloads: TPayloads[], params : TParams): Promise<any[]> => {
  const requests = payloads.map((item) => new Promise((resolve, reject) =>
    lambda.invoke({ ...lambdaParams, FunctionName, Payload: JSON.stringify({ item, params }) },
      (error, data) => (error ? reject(error) : resolve(data.Payload)))));
  const result = await Promise.all(requests);
  return result;
};
