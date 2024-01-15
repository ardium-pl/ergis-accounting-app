import polymerscanHandler from './polymerscan';
import mfgDataHandler from './mfgData';

export function addApiRoutes(router) {
    router.post("/send-mfg-data-for-faktoring", mfgDataHandler); 
    router.post("/api/polymerscan", polymerscanHandler);
}