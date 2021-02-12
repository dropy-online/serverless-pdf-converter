import { parallelRequest } from '@/utils';
import { Lambda as LambdaMock } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mock = { invoke: jest.fn() };
  return { Lambda: jest.fn(() => mock) };
});

describe('parallelRequest()', () => {
  const FunctionName = 'functionName';
  const items = [1, 2, 3];
  const params = { option: 'option' };
  const Lambda = new LambdaMock();

  it('should invoke lambda and return resolved data array', async () => {
    expect.hasAssertions();

    (Lambda.invoke as jest.Mocked<any>).mockImplementation((payload, cb) => {
      cb(null, { Payload: payload });
    });

    const result = await parallelRequest(FunctionName, items, params);

    const expected = items.map((item) => ({
      FunctionName,
      Payload: JSON.stringify({ item, params }),
    }));
    expect(result).toStrictEqual(expected);
  });

  it('should handle error if invoke failure', async () => {
    expect.hasAssertions();

    const error = 'error';
    (Lambda.invoke as jest.Mocked<any>).mockImplementation((_, cb) => {
      cb(new Error(error));
    });

    await expect(parallelRequest(FunctionName, items, params)).rejects.toThrow(error);
  });
});
