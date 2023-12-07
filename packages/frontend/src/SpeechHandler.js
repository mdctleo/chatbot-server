import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { sendMessage, setUserInput } from "./UserInput/UserInputSlice";
import { store } from "./index";
import {
  selectImprovement,
  selectSessionId,
  selectUseLLM,
  selectTestSuite,
} from "./ExperimentConfig/ExperimentConfigSlice";

let recognizer = null;
let recognizedSpeechTextHolder = "";
let recordingTimeout = null;
/**
 * Time out recording after 60 seconds, $$$
 */
const recordingTimeoutLength = 60000;
/**
 * If the user pressed the stop button before fully recognized, just send the partial speech
 * Ideally we should display what is recognized to the user in the input box
 */
let recognizingSpeechTextHolder = "";

export const startSpeechRecognition = async () => {
  recognizedSpeechTextHolder = "";
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.REACT_APP_SPEECH_SERVICE_KEY,
    "centralus"
  );
  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
    store.dispatch(setUserInput(e.result.text));
    // recognizingSpeechTextHolder = e.result.text;
    console.log(recognizingSpeechTextHolder)
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
      // recognizedSpeechTextHolder += e.result.text;
      store.dispatch(setUserInput(e.result.text));
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

  recordingTimeout = setTimeout(stopSpeechRecognition, recordingTimeoutLength);
};

export const stopSpeechRecognition = () => {
  console.log('got into stop speech recognition')
  if (recognizer) {
    recognizer.stopContinuousRecognitionAsync();
    // if (recognizingSpeechTextHolder.length > 0 || recognizedSpeechTextHolder.length > 0) {
    //   const userInput = recognizedSpeechTextHolder.length > 0 ? recognizedSpeechTextHolder : recognizingSpeechTextHolder;
    //   const improvement = selectImprovement(store.getState());
    //   const sessionId = selectSessionId(store.getState());
    //   const useLLM = selectUseLLM(store.getState());
    //   const testSuite = selectTestSuite(store.getState());

    //   store.dispatch(
    //     sendMessage({
    //       userInput: userInput,
    //       improvement: improvement,
    //       sessionId: sessionId,
    //       useLLM: useLLM,
    //       testSuite: testSuite,
    //     })
    //   );
    // }
  }

  if (recordingTimeout) {
    clearTimeout(recordingTimeout);
  }

  recognizedSpeechTextHolder = "";
  recognizingSpeechTextHolder = "";
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
