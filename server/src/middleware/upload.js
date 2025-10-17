import multer from 'multer';
import path from 'path';
import { getUploadDir } from '../utils/paths.js';

const uploadDir = getUploadDir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 200 }, // 200MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.mov', '.avi', '.mkv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Unsupported file type'));
    cb(null, true);
  }
});
