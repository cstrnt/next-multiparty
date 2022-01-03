import { withFileUpload, getConfig } from '../../../dist';

export default withFileUpload(async function handler(req, res) {
  res.json(req.file)
});

export const config = getConfig()