// LoggingHandler.ts

export enum SourcesEnum {
    CLIENT_SENT_TO_SERVER = 'CLIENT_SENT_TO_SERVER',
    CLIENT_RECEIVED_FROM_SERVER = 'CLIENT_RECEIVED_FROM_SERVER',
    SERVER_RECEIVED_FROM_CLIENT = "SERVER_RECEIVED_FROM_CLIENT",
    SERVER_SENT_TO_CLIENT = "SERVER_SENT_TO_CLIENT",
    SERVER_SENT_TO_LLM = "SERVER_SENT_TO_LLM",
    SERVER_RECEIVED_FROM_LLM = "SERVER_RECEIVED_FROM_LLM"
  }
  
  export const sendLog = (messagePayload: any, timeStamp: number, source: SourcesEnum) => {
    messagePayload.timeStamp = timeStamp;
    messagePayload.source = source;
  
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(messagePayload),
      headers: { "Content-Type": "application/json" }
    };
  
    fetch("https://cs536.escglobal.co/v1/message/log", requestOptions)
      .catch((error) => console.log("logging error", error));
  };