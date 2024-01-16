import polymerscanHandler from './polymerscan.js';
import express from 'express';

const router = express.Router();

router.post("/api/polymerscan", polymerscanHandler);

export default router;