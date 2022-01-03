import { NextApiRequest, NextApiResponse } from 'next';
import { EnhancedFile, parseForm } from './lib/helpers';
import { HTTP_METHOD } from './lib/types';

type FormNextApiRequest = NextApiRequest & {
  files: EnhancedFile[];
  file?: EnhancedFile;
};

type Options = {
  allowedMethods?: HTTP_METHOD[];
  cleanFiles?: boolean;
};
const DEFAULT_OPTIONS: Options = {
  allowedMethods: ['POST'],
  cleanFiles: true,
};

/**
 * A higher order function that takes a handler function and returns a new handler function
 * that will parse the request body and attach all files from a `multipart/form-data` request
 * to the request object as `req.files` or `req.file`.
 * @param handler The request handler to wrap
 * @param options Options to configure the behavior of the higher order function
 * @returns the wrapped handler function
 */
export function withFileUpload(
  handler: (req: FormNextApiRequest, res: NextApiResponse) => Promise<void> | void,
  options?: Options
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const config = { ...DEFAULT_OPTIONS, ...options };
    if (!config.allowedMethods?.includes(req.method as HTTP_METHOD)) {
      res.status(405).end();
      return;
    }
    try {
      // If req.body is set, it means that next.js parsed the body already
      if(req.body){
        throw new Error("Invalid config. Please export the config as the variable `const`")
      }
      const files = await parseForm(req);
      await handler(
        { ...req, files, file: files[0] } as FormNextApiRequest,
        res
      );
      await Promise.all(files.map(file => file.destroy()));
    } catch (e) {
      console.error(e)
      res.status(500).end();
    }
  };
}
