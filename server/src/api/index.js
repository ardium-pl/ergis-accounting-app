import polymerscanHandler from './polymerscan.js';
import express from 'express';
import multer from 'multer';

const upload = multer({ dest: "_uploads/" });

const router = express.Router();

router.post("/api/polymerscan", upload.array('files'), polymerscanHandler);

export default router;