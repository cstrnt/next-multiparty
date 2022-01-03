import { NextApiRequest } from 'next';
import { parseForm } from '../src/lib/helpers';

describe('helpers', () => {
  describe('parseForm', () => {
    it('should throw an error if the headers are incorrect', async () => {
      expect(() => parseForm({ headers: {} } as NextApiRequest)).toThrowError(
        /Content-Type/i
      );
    });
  });
});
