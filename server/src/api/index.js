import polymerscanHandler from './polymerscan.js';
import mfgDataHandler from './mfgData.js';
import express from 'express';

const router = express.Router();

router.post("/api/mfg", mfgDataHandler);
router.post("/api/polymerscan", polymerscanHandler);

export default router;