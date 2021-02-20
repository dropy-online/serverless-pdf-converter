import aws from 'aws-sdk';

const lambdaConfig = {
  apiVersion: '2031',
  endpoint:
    process.env.STAGE === 'dev'
      ? 'http://localhost:3002'
      : `https://lambda.${process.env.REGION}.amazonaws.com`,
};

export const parallelRequest = async <TItems extends unknown[], TParams, TResult>(
  functionName: string,
  items: TItems,
  params: TParams
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
          (apiError, { Payload } = {}) => {
            const payload = typeof Payload === 'string' ? JSON.parse(Payload) : Payload;
            const error = apiError || payload.errorMessage;
            return error ? reject(error) : resolve(payload);
          }
        );
      })
  );
  const result = await Promise.all(requests);
  return result;
};
