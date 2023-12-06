import { useSelector } from "react-redux";
import { selectMessages } from "./MessageThreadSlice";
import { MessageThread } from "@azure/communication-react";
import { textToSpeech } from "../SpeechHandler";
import { Text } from "@fluentui/react-components";
import "./MessageThreadView.css";

export function MessageThreadView() {
  const messageThreadStyle = {
    chatMessageContainer: {
      fontStyle: "italic",
      boxShadow:
        "0px 3.2px 7.2px rgb(0 0 0 / 13\u0025), 0px 0.6px 1.8px rgb(0 0 0 / 11\u0025)",
      marginLeft: "0px",
    },
    myChatMessageContainer: {
      fontStyle: "italic",
      boxShadow:
        "0px 3.2px 7.2px rgb(0 0 0 / 13\u0025), 0px 0.6px 1.8px rgb(0 0 0 / 11\u0025)",
      marginLeft: "0px",
    },
    systemMessageContainer: { fontWeight: "bold", border: "double red" },
  };

  const messages = useSelector(selectMessages);

  return (
    <MessageThread
      className="message-thread-view"
      showMessageDate={true}
      messageThreadStyle={messageThreadStyle}
      messages={messages}
      onRenderMessage={(message, _messageProps) => (
        <CustomMessageBubble message={message} />
      )}
    />
  );
}

function getBubbleClass(message) {
  let className = "message-bubble";

  if (message.message.senderId === "user") {
    className += " user";
  } else {
    className += " llm";
  }

  return className;
}

function CustomMessageBubble({ message }) {
  let pressTimer;

  return (
    <div
      className={getBubbleClass(message)}
      onClick={() => textToSpeech(message.message.content)}
    >
      <Text variant="small" style={{ fontWeight: "bold", color: "#323130" }}>
        {message.message.senderDisplayName}
      </Text>
      <Text variant="small" style={{ color: "#323130" }}>
        {message.message.content}
      </Text>
    </div>
  );
}
