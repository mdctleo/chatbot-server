import { createSlice } from '@reduxjs/toolkit'
import { sendWebSocketMessage } from '../WebSocketHandler'
import { sendHTTPMessage } from '../HTTPHandler'

const initialState = {}

const userInputSlice = createSlice({
  name: 'userInput',
  initialState,
  reducers: {
    // Give case reducers meaningful past-tense "event"-style names
    sendMessage(state, action) {
      const { messagePayload, improvement, sessionId } = action.payload
      console.log(messagePayload)
      console.log(improvement)

      messagePayload.sessionId = sessionId
      messagePayload.exchangeId = Math.random().toString()
      messagePayload.improvement = improvement
      
      if (improvement === 'WEBSOCKET') {
        sendWebSocketMessage(messagePayload)
      } else if (improvement === 'HTTP') {
        sendHTTPMessage(messagePayload)
      }
    }
  }
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { sendMessage } = userInputSlice.actions

// Export the slice reducer as the default export
export default userInputSlice.reducer