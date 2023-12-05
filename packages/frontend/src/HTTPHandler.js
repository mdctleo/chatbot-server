import { messageAdded } from "./MessageThread/MessageThreadSlice";
import { store } from "./index";
import { sendLog, SourcesEnum } from "logger";

export const sendHTTPMessage = async (messagePayload) => {
  const messageLeaveClientTimestamp = new Date().getTime();
  sendLog(messagePayload, messageLeaveClientTimestamp, SourcesEnum.CLIENT_SENT_TO_SERVER);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    // store.dispatch(messageAdded(data.body));
  } catch (error) {
    console.error("Error:", error);
  }
};

