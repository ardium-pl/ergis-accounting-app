import express from "express";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import { addApiRoutes } from "./api/index.js";
import { addClientRoutes } from './routes/index.js';
import 'dotenv/config.js';

const app = express();
const port = process.env.PORT || 3000;

global.__dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

const router = express.Router();

addApiRoutes(router);
addClientRoutes(router);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

export default app;
