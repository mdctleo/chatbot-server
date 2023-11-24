import { createSlice } from '@reduxjs/toolkit'
import ws from '../WebSocketHandler'

const initialState = {}

const userInputSlice = createSlice({
  name: 'userInput',
  initialState,
  reducers: {
    // Give case reducers meaningful past-tense "event"-style names
    sendMessage(state, action) {
      const { message, improvement } = action.payload
      console.log(message)
      console.log(improvement)
      
      if (improvement === 'WEBSOCKET') {
        ws.send(JSON.stringify(message))
      } else if (improvement === 'HTTP') {
        console.log("NOT YET IMPLMENETED")
      }
    }
  }
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { sendMessage } = userInputSlice.actions

// Export the slice reducer as the default export
export default userInputSlice.reducer