import { SendBox, FluentThemeProvider } from "@azure/communication-react";
import React from "react";
import { useDispatch } from "react-redux";
import { selectIsResponding, sendMessage } from "./UserInputSlice";
import {
  selectImprovement,
  selectSessionId,
  selectUseLLM,
  selectTestSuite,
} from "../ExperimentConfig/ExperimentConfigSlice";
import { store } from "../index";
import "./UserInputView.css";
import { Mic24Regular } from "@fluentui/react-icons";
export function UserInputView() {
  const dispatch = useDispatch();
  return (
    <FluentThemeProvider>
      <div className="user-input-view">
        <div className="input-box">
          <SendBox
            onSendMessage={async (message) => {
              handleSend(message, dispatch);
            }}
            onTyping={async () => {
              return;
            }}
          />
        </div>
        <button
          className="microphone-icon"
          onClick={() => console.log("Mic button clicked")}
        >
          <Mic24Regular />
        </button>
      </div>
    </FluentThemeProvider>
  );
}

const handleSend = (message, dispatch) => {
  const improvement = selectImprovement(store.getState());
  const sessionId = selectSessionId(store.getState());
  const useLLM = selectUseLLM(store.getState());
  const testSuite = selectTestSuite(store.getState());

  dispatch(
    sendMessage({
      userInput: message,
      improvement: improvement,
      sessionId: sessionId,
      useLLM: useLLM,
      testSuite: testSuite,
    })
  );
};
