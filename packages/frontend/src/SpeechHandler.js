import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const startSpeechRecognition = async () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription('YourSubscriptionKey', 'YourServiceRegion');
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  
    recognizer.recognizing = (s, e) => {
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };
  
    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
        // handleSend(e.result.text, dispatch);
      }
      else if (e.result.reason === sdk.ResultReason.NoMatch) {
        console.log('NOMATCH: Speech could not be recognized.');
      }
    };
  
    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);
  
      if (e.reason === sdk.CancellationReason.Error) {
        console.log(`CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log('CANCELED: Did you update the subscription info?');
      }
  
      recognizer.stopContinuousRecognitionAsync();
    };
  
    recognizer.sessionStopped = (s, e) => {
      console.log('\n    Session stopped event.');
      recognizer.stopContinuousRecognitionAsync();
    };
  
    recognizer.startContinuousRecognitionAsync();
  };