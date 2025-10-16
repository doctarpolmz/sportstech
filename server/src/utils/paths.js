import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getUploadDir() {
  const configured = process.env.UPLOAD_DIR;
  const resolved = configured
    ? path.resolve(configured)
    : path.resolve(path.join(__dirname, '../uploads'));
  if (!fs.existsSync(resolved)) {
    fs.mkdirSync(resolved, { recursive: true });
  }
  return resolved;
}
