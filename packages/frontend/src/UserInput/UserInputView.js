import { SendBox } from "@azure/communication-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectIsRecording, selectIsResponding, sendMessage, setIsRecording, selectUserInput, setUserInput } from "./UserInputSlice";
import {
  selectImprovement,
  selectSessionId,
  selectUseLLM,
  selectTestSuite,
} from "../ExperimentConfig/ExperimentConfigSlice";
import { store } from "../index";
import "./UserInputView.css";
import { Mic24Regular, Stop24Regular, Send16Regular } from "@fluentui/react-icons";
import { startSpeechRecognition, stopSpeechRecognition } from "../SpeechHandler";
import { Spinner, Input } from "@fluentui/react-components";

export function UserInputView() {
  const dispatch = useDispatch();
  const isRecording = useSelector(selectIsRecording)
  const isResponding = useSelector(selectIsResponding)
  const userInput = useSelector(selectUserInput)

  const handleMicButton = () => {
    if (isRecording) {
        console.log("stop recording")
        stopSpeechRecognition();
    } else {
        console.log("start recording")
        startSpeechRecognition();
    }

    dispatch(setIsRecording(!isRecording));
}

const handleSend = (message) => {
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

  return (
    <>
      {(isResponding || isRecording) && <Spinner appearance="primary" label="Loading..."/>}
      <div className="user-input-view">
        <div className="input-box">
          <Input 
              value={userInput}
              onChange={(e) => dispatch(setUserInput(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(userInput)
                }
              }}
              placeholder="Type your message here"
              contentAfter={<Send16Regular onClick={() => handleSend(userInput)} />}
              style={{ width: "100%" }}
          />
        </div>
        <button
          className="microphone-icon"
          onClick={handleMicButton}
        >
          {isRecording? <Stop24Regular /> : <Mic24Regular />}
        </button>
      </div>
    </>
  );
}
