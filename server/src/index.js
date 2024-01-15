import express from "express";
import cors from "cors";
import { addApiRoutes } from "./api";
import { addClientRoutes } from './routes/index';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const router = express.Router();

addApiRoutes(router);
addClientRoutes(router);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
