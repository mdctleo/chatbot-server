// LoggingHandler.ts

export enum SourcesEnum {
    CLIENT_SENT_TO_SERVER = 'CLIENT_SENT_TO_SERVER',
    CLIENT_RECEIVED_FROM_SERVER = 'CLIENT_RECEIVED_FROM_SERVER',
  }
  
  export interface MessagePayload {
    timeStamp: number;
    source: SourcesEnum;
    // Add other properties here
  }
  
  export const sendLog = (messagePayload: MessagePayload, timeStamp: number, source: SourcesEnum) => {
    console.log("Calling sendLog")
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