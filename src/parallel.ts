import aws from 'aws-sdk';
import { Options } from '@/options';

const lambda = new aws.Lambda({
  region: 'ap-northeast-2',
});

// TODO
const params = {
  FunctionName: '',
  InvocationType: 'Event',
};

export const paralleConvert = async<T>(arr: T[], options : Options) => {
  const requests = arr.map((item) => new Promise((resolve, reject) =>
    lambda.invoke({ ...params, Payload: { item, options } },
      (error, data) => (error ? reject(error) : resolve(data)))));
  const result = await Promise.all(requests);
  return result;
};
