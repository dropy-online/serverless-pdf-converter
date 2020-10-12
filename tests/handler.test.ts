import { endpoint } from '@/handler';

describe('endpoint', () => {
  it('should return 200', async () => {
    expect.hasAssertions();
    const res = await endpoint();
    expect(res.statusCode).toBe(200);
  });
});
