import aws from 'aws-sdk';

const lambdaConfig = {
  apiVersion: '2031',
  endpoint:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3002'
      : `https://lambda.${process.env.REGION}.amazonaws.com`,
};

export const parallelRequest = async <TItems extends any[], TParams, TResult>(
  functionName: string,
  items: TItems,
  params: TParams,
): Promise<TResult[]> => {
  const lambda = new aws.Lambda(lambdaConfig);
  const requests = items.map(
    (item) =>
      new Promise<TResult>((resolve, reject) => {
        lambda.invoke(
          {
            FunctionName: functionName,
            Payload: JSON.stringify({ item, params }),
          },
          (error, data) =>
            error ? reject(error) : resolve(data.Payload as TResult)
        );
      })
  );
  const result = await Promise.all(requests);
  return result;
};
