import { NextApiRequest, NextApiResponse } from 'next';
import { withFileUpload, getConfig, FormNextApiRequest } from '../../../dist';

 async function handler(req: FormNextApiRequest, res: NextApiResponse) {
  res.json({ file: req.file, fields: req.fields });
};

export default withFileUpload(handler)

export const config = getConfig();
