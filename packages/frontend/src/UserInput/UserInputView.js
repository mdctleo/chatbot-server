import { SendBox, FluentThemeProvider } from "@azure/communication-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectIsRecording, sendMessage, setIsRecording } from "./UserInputSlice";
import {
  selectImprovement,
  selectSessionId,
  selectUseLLM,
  selectTestSuite,
} from "../ExperimentConfig/ExperimentConfigSlice";
import { store } from "../index";
import "./UserInputView.css";
import { Mic24Regular, Stop24Regular } from "@fluentui/react-icons";
import { startSpeechRecognition, stopSpeechRecognition } from "../SpeechHandler";

export function UserInputView() {
  const dispatch = useDispatch();
  const isRecording = useSelector(selectIsRecording)

  const handleMicButton = () => {
    // const isRecording = useSelector(selectIsRecording);
    if (isRecording) {
        console.log("stop recording")
        stopSpeechRecognition();
    } else {
        console.log("start recording")
        startSpeechRecognition();
    }

    dispatch(setIsRecording(!isRecording));
}

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
          onClick={handleMicButton}
        >
          {isRecording? <Stop24Regular /> : <Mic24Regular />}
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
