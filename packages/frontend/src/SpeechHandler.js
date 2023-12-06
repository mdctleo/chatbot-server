import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { sendMessage } from "./UserInput/UserInputSlice";
import { store } from "./index";
import {
  selectImprovement,
  selectSessionId,
  selectUseLLM,
  selectTestSuite,
} from "./ExperimentConfig/ExperimentConfigSlice";

let recognizer;
let speechTextHolder = "";

export const startSpeechRecognition = async () => {
  speechTextHolder = "";
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.REACT_APP_SPEECH_SERVICE_KEY,
    "centralus"
  );
  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
      speechTextHolder += e.result.text;
    } else if (e.result.reason === sdk.ResultReason.NoMatch) {
      console.log("NOMATCH: Speech could not be recognized.");
    }
  };

  recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason === sdk.CancellationReason.Error) {
      console.log(`CANCELED: ErrorCode=${e.errorCode}`);
      console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
      console.log("CANCELED: Did you update the subscription info?");
    }

    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.startContinuousRecognitionAsync();
};

export const stopSpeechRecognition = () => {
  if (recognizer) {
    recognizer.stopContinuousRecognitionAsync();
    if (speechTextHolder.length > 0) {
      const improvement = selectImprovement(store.getState());
      const sessionId = selectSessionId(store.getState());
      const useLLM = selectUseLLM(store.getState());
      const testSuite = selectTestSuite(store.getState());

      store.dispatch(
        sendMessage({
          userInput: speechTextHolder,
          improvement: improvement,
          sessionId: sessionId,
          useLLM: useLLM,
          testSuite: testSuite,
        })
      );
      speechTextHolder = "";
    }
  }
};

export const textToSpeech = (text) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.REACT_APP_SPEECH_SERVICE_KEY,
    "centralus"
  );
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  synthesizer.speakTextAsync(
    text,
    (result) => {
      if (result) {
        console.log(`STATUS: Text=${result.text}`);
      }
      synthesizer.close();
    },
    (error) => {
      console.log(`ERROR: ${error}`);
      synthesizer.close();
    }
  );
};
