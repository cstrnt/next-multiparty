import { withFileUpload } from '../src';
import { parseForm } from '../src/lib/helpers';
import httpMocks from 'node-mocks-http';

jest.mock('../src/lib/helpers', () => ({
  parseForm: jest.fn().mockResolvedValue([]),
}));

describe('withFileUpload', () => {
  it('should return 405 if the method is false', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
    });
    const response = httpMocks.createResponse();
    await withFileUpload((() => {}) as any)(request, response);
    expect(response.statusCode).toBe(405);
  });

  it('execute the handler if the request is valid', async () => {
    const request = httpMocks.createRequest({
      method: 'POST',
    });
    const response = httpMocks.createResponse();

    await withFileUpload(async (_req, res) => {
      res.status(123).end();
    })(request, response);

    expect(parseForm as jest.Mock).toHaveBeenCalled();
    expect(response.statusCode).toBe(123);
  });

  it('should return 500 if the handler throws an error', async () => {
    (parseForm as jest.Mock).mockRejectedValueOnce(new Error('test'));
    const request = httpMocks.createRequest({
      method: 'POST',
    });
    const response = httpMocks.createResponse();

    await withFileUpload(async (_req, res) => {
      res.status(123).end();
    })(request, response);

    expect(parseForm as jest.Mock).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
  });

  it('should clean up all files', async () => {
    const destroyFunc = jest.fn();
    (parseForm as jest.Mock).mockResolvedValueOnce([{ destroy: destroyFunc }]);
    const request = httpMocks.createRequest({
      method: 'POST',
    });
    const response = httpMocks.createResponse();

    await withFileUpload(async (_req, res) => {
      res.status(123).end();
    })(request, response);

    expect(parseForm as jest.Mock).toHaveBeenCalled();
    expect(destroyFunc).toHaveBeenCalled();
    expect(response.statusCode).toBe(123);
  });
});
