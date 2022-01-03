import { withFileUpload, getConfig } from '../../../dist';

export default withFileUpload(async function handler(req, res) {
  res.json({ file: req.file, fields: req.fields });
});

export const config = getConfig();
