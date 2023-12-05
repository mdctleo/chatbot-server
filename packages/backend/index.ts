// Import the express in typescript file
import express from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import { CustomWebSocketServer } from './CustomWebSocketServer';
import path from 'path';
import { generateFakePlaceHolderMessages } from './MessageFomatter';
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

    console.log(requestBody.message.content);

    const llmResp = await getLLMResponse(requestBody.message.content);
    const responseBody = generateFakePlaceHolderMessages(llmResp, requestBody.sessionId, requestBody.exchangeId, requestBody.improvement);

    res.send({body: responseBody});
    
    timeStamp = new Date().getTime();
    sendLog(responseBody, timeStamp, SourcesEnum.SERVER_SENT_TO_CLIENT);
});

// Server setup
const httpServer = app.listen(port, () => {
    console.log(`Server is listening at
         http://localhost:${port}/`);
});

const cwss = new CustomWebSocketServer({ server: httpServer });

// cwss.on('connection', (ws) => {
//     console.log('a new client connected!')

//     ws.on('message', async (message) => {
//         // parse json message        
//         const req = JSON.parse(message.toString());

//         // handle client requests
//         if (req.type == 'stream') {
//             // call gpt api
//             const text = req.query;
//             const llmResult = await llm.predict(text);
            
//             console.log(llmResult);

//             // send response
//             // ws.send(JSON.stringify(llmResult));
//         }
//     });
// });