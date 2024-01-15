import polymerscanHandler from './polymerscan';
import mfgDataHandler from './mfgData';

export function addApiRoutes(router) {
    router.post("/api/mfg", mfgDataHandler); 
    router.post("/api/polymerscan", polymerscanHandler);
}