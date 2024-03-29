import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendWebSocketMessage } from "../WebSocketHandler";
import { sendHTTPMessage } from "../HTTPHandler";
import { messageAdded } from "../MessageThread/MessageThreadSlice";
import { sendWebRTCMessage } from "../WebRTCHandler";

const initialState = {
  isResponding: false,
  isRecording: false,
  userInput: ""
};

export const sendMessage = createAsyncThunk(
  "userInput/sendMessage",
  async (
    { userInput, improvement, sessionId, useLLM, testSuite },
    { dispatch, getState }
  ) => {

    let numTimesToQuery = 1;

    if (testSuite === "RUN_10_QUERIES") {
      numTimesToQuery = 10;
    } else if (testSuite === "RUN_50_QUERIES") {
      numTimesToQuery = 50;
    }

    for (let i = 0; i < numTimesToQuery; i++) {
      dispatch(setIsResponding(true))

      const messagePayload = {
        // This message object is the format the UI library expects
        // We should add our fields outside the message object so it will easy to extract and display
        message: {
          messageType: "chat",
          senderId: "user",
          senderDisplayName: "User",
          messageId: Math.random().toString(),
          content: userInput,
          // TODO: Have all dates in unix time until display
          // createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
          mine: true,
          attached: false,
          status: "seen",
          contentType: "html",
        },
      };

      // Add user input into the message thread
      dispatch(messageAdded({ message: messagePayload.message }));
      dispatch(setUserInput(""));

      /**
       * Our metadata
       */
      messagePayload.sessionId = sessionId;
      messagePayload.exchangeId = Math.random().toString();
      messagePayload.improvement = improvement;
      messagePayload.useLLM = useLLM;

      if (improvement === "WEBSOCKET") {
        sendWebSocketMessage(messagePayload);
      } else if (improvement === "HTTP") {
        const data = await sendHTTPMessage(messagePayload);
        dispatch(messageAdded(data.body));
        dispatch(setIsResponding(false));
      } else if (improvement === "WEBRTC") {
        sendWebRTCMessage(messagePayload);
      }
    }
  }
);

const userInputSlice = createSlice({
  name: "userInput",
  initialState,
  reducers: {
    setIsRecording (state, action) {
      state.isRecording = action.payload;
    },
    setIsResponding (state, action) {
      state.isResponding = action.payload;
    },
    setUserInput (state, action) {
      state.userInput = action.payload;
    }
  },
});

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { setIsRecording, setIsResponding, setUserInput } = userInputSlice.actions
export const selectIsResponding = (state) => state.userInput.isResponding;
export const selectIsRecording = (state) => state.userInput.isRecording;
export const selectUserInput = (state) => state.userInput.userInput;

// Export the slice reducer as the default export
export default userInputSlice.reducer;
