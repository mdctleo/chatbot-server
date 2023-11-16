// Import the express in typescript file
import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import { CustomWebSocketServer } from './CustomWebSocketServer';
import path from 'path';

// Initialize the express engine
const app: express.Application = express();
dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}
 
// Take a port 8000 for running server.
const port: number = Number(process.env.PORT) || 8000;

app.use(express.static(path.join(__dirname, './public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + './public/index.html'));
});
 
// Handling '/' Request
app.get('/api', (_req, _res) => {
    _res.send({body: "Hello World"});
});
 
// Server setup
const httpServer = app.listen(port, () => {
    console.log(`Server is listening at
         http://localhost:${port}/`);
});

const cwss = new CustomWebSocketServer({ server: httpServer });
