import { createSlice } from '@reduxjs/toolkit'
import { sendMessage } from '../UserInput/UserInputSlice'

const initialState = []

const messageThreadSlice = createSlice({
  name: 'messageThread',
  initialState,
  reducers: {
    messageAdded(state, action) {
      const { message } = action.payload
      state.push(message)
    },
  },
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { messageAdded } = messageThreadSlice.actions

export const selectMessages = state => state.messageThread

// Export the slice reducer as the default export
export default messageThreadSlice.reducer