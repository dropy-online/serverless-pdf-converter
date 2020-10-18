import aws from 'aws-sdk';

const lambda = new aws.Lambda({
  region: 'ap-northeast-2',
});

// TODO
const lambdaParams = {
  InvocationType: 'Event',
};

export const parallelRequest = async<TPayloads, TParams>
(FunctionName: string, payloads: TPayloads[], params : TParams): Promise<any[]> => {
  const requests = payloads.map((item) => new Promise((resolve, reject) =>
    lambda.invoke({ ...lambdaParams, FunctionName, Payload: { item, params } },
      (error, data) => (error ? reject(error) : resolve(data.Payload)))));
  const result = await Promise.all(requests);
  return result;
};
