import { parallelRequest } from '@/utils';
import aws from 'aws-sdk';

jest.mock('aws-sdk');

describe('parallelRequest()', () => {
  const FunctionName = 'functionName';
  const items = [1, 2, 3];
  const params = { option: 'option' };

  it('should invoke lambda and return resolved data array', async () => {
    expect.hasAssertions();

    const invoke = jest.fn().mockImplementation((payload, cb) => {
      cb(null, { Payload: payload });
    });
    jest.spyOn(aws, 'Lambda').mockImplementation(() => ({ invoke }));

    const result = await parallelRequest(FunctionName, items, params);

    const expected = items.map((item) => ({
      InvocationType: 'Event',
      FunctionName,
      Payload: JSON.stringify({ item, params }),
    }));
    expect(result).toStrictEqual(expected);
  });

  it('should handle error if invoke failure', async () => {
    expect.hasAssertions();

    const error = 'error';
    const invoke = jest.fn().mockImplementation((_, cb) => {
      cb(new Error(error));
    });
    jest.spyOn(aws, 'Lambda').mockImplementation(() => ({ invoke }));

    await expect(parallelRequest(FunctionName, items, params)).rejects.toThrow(error);
  });
});
