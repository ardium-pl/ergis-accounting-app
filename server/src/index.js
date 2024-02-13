import 'dotenv/config.js';
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Server received a request');
    res.send('The server is working!');
});

app.use(router);

// app.use(apiRouter);
// app.use(clientRouter);

console.log('Server is starting up...');

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

export default app;
