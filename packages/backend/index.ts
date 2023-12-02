// Import the express in typescript file
import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import { CustomWebSocketServer } from './CustomWebSocketServer';
import path from 'path';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

// Initialize the express engine
const app: express.Application = express();
dotenv.config();

const llm = new OpenAI({
    temperature: 0.9,
});

const chatModel = new ChatOpenAI();

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

cwss.on('connection', (ws) => {
    console.log('a new client connected!')

    ws.on('message', async (message) => {
        // parse json message        
        const req = JSON.parse(message.toString());

        // handle client requests
        if (req.type == 'stream') {
            // call gpt api
            const text = req.query;
            const llmResult = await llm.predict(text);
            
            console.log(llmResult);

            // send response
            // ws.send(JSON.stringify(llmResult));
        }
    });
});