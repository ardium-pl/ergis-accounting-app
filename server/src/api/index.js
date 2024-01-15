import polymerscanHandler from './polymerscan.js';
import mfgDataHandler from './mfgData.js';

export function addApiRoutes(router) {
    router.post("/api/mfg", mfgDataHandler);
    router.post("/api/polymerscan", polymerscanHandler);
}