import formidable from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';

export type EnhancedFile = formidable.File & {
  name: string;
  toBuffer: () => Promise<Buffer>;
  destroy: () => Promise<void>;
};

export function parseForm(req: NextApiRequest) {
  if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
    throw new Error("Invalid Content-Type Header")
  }
  return new Promise<Array<EnhancedFile>>((resolve, reject) => {
    formidable({}).parse(req, (err, _fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        Object.entries(files).map(([name, file]) => {
          const singleFile = Array.isArray(file) ? file[0] : file;
          return {
            ...singleFile,
            name,
            toBuffer: () => fs.promises.readFile(singleFile.filepath),
            destroy: () => fs.promises.unlink(singleFile.filepath),
          };
        })
      );
    });
  });
}

/**
 * A small helper function to wrap the api route config with the
 * *needed* configuration for the `withFileUpload` higher order function.
 * @param config the default api route config
 * @returns the passed config merged with the necessary config for the `withFileUpload` higher order function
 */
export function getConfig(config?: Record<string, any>){
  return {
    ...config,
    api: {
      ...config?.api,
      bodyParser: false,
    }
  }
}
