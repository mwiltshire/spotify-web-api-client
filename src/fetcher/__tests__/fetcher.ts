import { fetcher } from '../fetcher';

describe('fetcher', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('calls global fetch with request init object', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({})
      })
    );

    const response = await fetcher({
      url: 'https://api.test.com/test',
      method: 'GET',
      headers: {
        Authorization: 'Bearer 1234'
      },
      params: {
        foo: 123
      }
    });

    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/test?foo=123',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        signal: null
      }
    );
  });

  it('catches and rethrows error thrown by fetch', async () => {
    (global.fetch as any) = jest.fn(() => Promise.reject(new Error('ERROR')));

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('Error');
      expect(error.message).toBe('ERROR');
    }
  });

  it('throws if response.ok is false - regular error', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 401,
        ok: false,
        json: () => Promise.resolve({ error: { message: 'ERROR' } })
      })
    );

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('RegularError');
      expect(error.message).toBe('ERROR');
    }
  });

  it('throws if response.ok is false - player error', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 400,
        ok: false,
        json: () =>
          Promise.resolve({
            error: { message: 'ERROR', reason: 'RATE_LIMITED' }
          })
      })
    );

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'PUT',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('PlayerError');
      expect(error.reason).toBe('RATE_LIMITED');
    }
  });

  it('throws if response.ok is false - authentication error', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 400,
        ok: false,
        json: () => Promise.resolve({ error: 'ERROR' })
      })
    );

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('ERROR');
    }
  });

  it('throws if response.ok is false - unknown error', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 400,
        ok: false,
        json: () => Promise.resolve({ message: 'ERROR' })
      })
    );

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('Error');
      expect(error.message).toBe(
        'Unknown Error: Request to https://api.test.com/test failed with status 400'
      );
    }
  });

  it('will not try to JSON parse on 204 response', async () => {
    const mockJson = jest.fn(() => {
      throw new Error();
    });

    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 204,
        ok: true,
        json: mockJson
      })
    );

    const res = await fetcher({
      url: 'https://api.test.com/test',
      method: 'GET'
    });

    expect(mockJson).not.toHaveBeenCalled();
    expect(res.body).toBeUndefined();
  });
});
