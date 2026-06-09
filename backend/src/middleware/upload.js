const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const BASE = path.join(__dirname, '../../public/uploads');
const ensure = dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('image/') ? 'images'
      : file.mimetype.startsWith('video/') ? 'videos'
      : file.mimetype === 'application/pdf' ? 'pdfs' : 'documents';
    const dir = path.join(BASE, folder);
    ensure(dir);
    req.uploadFolder = folder;
    cb(null, dir);
  },
  filename: (_req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`),
});

const fileFilter = (_req, file, cb) => {
  const ok = /jpeg|jpg|png|gif|webp|svg|mp4|webm|mov|pdf|doc|docx/.test(
    path.extname(file.originalname).toLowerCase().slice(1));
  ok ? cb(null, true) : cb(new Error('File type not supported'), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 250 * 1024 * 1024 },
});
