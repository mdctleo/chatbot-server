import { messageAdded } from "./MessageThread/MessageThreadSlice";
import { store } from "./index";
import { sendLog, SourcesEnum } from "chatbot-logger";

export const sendHTTPMessage = (messagePayload) => {
  const messageLeaveClientTimestamp = new Date().getTime();

  fetch(`${process.env.REACT_APP_API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messagePayload),
  })
    .then((response) => response.json())
    .then((data) => {
      store.dispatch(messageAdded(data.body))
    })
    .catch((error) => {
      console.error("Error:", error);
  });

  sendLog(messagePayload, messageLeaveClientTimestamp, SourcesEnum.CLIENT_SENT_TO_SERVER);

};

