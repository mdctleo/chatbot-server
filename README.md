# chatbot-server

## Getting Started
You will need lerna >= 7.3.0, node >= 18.17.1 and npm >= 9.6.7

At the root of the project run
`npm install`

To start run
`npm start`

You will need a `.env` file inside `packages/frontend/` with the following variables set to the backend host and port, which by default should be http://localhost:8000
```
REACT_APP_API_URL=
REACT_APP_WEBSOCKET=
```

## Algorithm Improvement Ideas

WebSocket v.s. WebRTC

## Architecture

- iOS and Android will provide basic scaffolding and the UX will be a web view
- chatbot-server is a mono-repo that will contain front end and back end
- iOS and Android on launch will request for the UX from chatbot-sever
- iOS and Android will communicate to the LLM (Large Language Model) through chatbot server back end

![image](https://github.com/mdctleo/chatbot-server/assets/31061195/ffc113b9-6b0c-4f3e-907b-d93b1f60a389)
