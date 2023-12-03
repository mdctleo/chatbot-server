import { createSlice } from '@reduxjs/toolkit'
import { sendMessage } from '../UserInput/UserInputSlice'

const initialState = []

const messageThreadSlice = createSlice({
  name: 'messageThread',
  initialState,
  reducers: {
    messageAdded(state, action) {
      console.log("got into messageAdded")
      state.push(action.payload)
    },
  },

  extraReducers: (builder) => {
    builder.addCase(sendMessage, (state, action) => {
      const { messagePayload } = action.payload
      state.push(messagePayload.message)
  }) 
}})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { messageAdded } = messageThreadSlice.actions

export const selectMessages = state => state.messageThread

// Export the slice reducer as the default export
export default messageThreadSlice.reducer