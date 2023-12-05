// Import the express in typescript file
import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import { CustomWebSocketServer } from './CustomWebSocketServer';
import path from 'path';
import { generateMessageFormat } from './MessageFomatter';
import { sendLog, SourcesEnum } from 'logger';
import bodyParser from 'body-parser';
import { getLLMResponse } from './LMService';

// Initialize the express engine
const app: express.Application = express();
dotenv.config();

app.use(bodyParser.json());

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

app.post('/api/query', async (req, res) => {
    let timeStamp = new Date().getTime();
    const requestBody = req.body;
    sendLog(requestBody, timeStamp, SourcesEnum.SERVER_RECEIVED_FROM_CLIENT);

    let llmResp = "This is a test response from the WebSocket protocol"

    timeStamp = new Date().getTime();
    sendLog(requestBody, timeStamp, SourcesEnum.SERVER_SENT_TO_LLM);

    if (requestBody.useLLM === true) {
        llmResp = await getLLMResponse(requestBody.message.content);
    }
    
    timeStamp = new Date().getTime();
    sendLog(requestBody, timeStamp, SourcesEnum.SERVER_RECEIVED_FROM_LLM);

    const responseBody = generateMessageFormat(llmResp, requestBody.sessionId, requestBody.exchangeId, requestBody.improvement);

    timeStamp = new Date().getTime();
    sendLog(responseBody, timeStamp, SourcesEnum.SERVER_SENT_TO_CLIENT);
    res.send({body: responseBody});
});

// Server setup
const httpServer = app.listen(port, () => {
    console.log(`Server is listening at
         http://localhost:${port}/`);
});

const cwss = new CustomWebSocketServer({ server: httpServer });