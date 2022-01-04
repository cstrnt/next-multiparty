import formidable from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';

export type EnhancedFile = formidable.File & {
  name: string;
  toBuffer: () => Promise<Buffer>;
  destroy: () => Promise<void>;
};

/**
 * Asynchronous wrapper around formidable
 * which parses the request body and attaches all files and fields from a `multipart/form-data` request
 * to the request object as `req.files` (`req.file`) or `req.fields`.
 * files and files are flattened into a single entry
 * @param req The request object
 * @returns the files
 */
export function parseForm(req: NextApiRequest) {
  if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
    throw new Error('Invalid Content-Type Header');
  }
  return new Promise<{
    files: EnhancedFile[];
    fields: Record<string, string>;
  }>((resolve, reject) => {
    formidable({}).parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      const parsedFiles: Array<EnhancedFile> = Object.entries(files).map(
        ([name, file]) => {
          const singleFile = Array.isArray(file) ? file[0] : file;
          return {
            ...singleFile,
            name,
            toBuffer: () => fs.promises.readFile(singleFile.filepath),
            destroy: () =>
              // we just ignore the error here because if the file doesn't exist,
              // we don't need to delete it anymore
              fs.promises.unlink(singleFile.filepath).catch(() => {}),
          };
        }
      );
      const parsedFields = Object.entries(fields).reduce<
        Record<string, string>
      >((acc, [name, value]) => {
        acc[name] = Array.isArray(value) ? value[0] : value;
        return acc;
      }, {});

      return resolve({ files: parsedFiles, fields: parsedFields });
    });
  });
}

/**
 * A small helper function to wrap the api route config with the
 * *needed* configuration for the `withFileUpload` higher order function.
 * @param config the default api route config
 * @returns the passed config merged with the necessary config for the `withFileUpload` higher order function
 */
export function getConfig(config?: Record<string, any>) {
  return {
    ...config,
    api: {
      ...config?.api,
      bodyParser: false,
    },
  };
}
