import { createSlice } from '@reduxjs/toolkit'
import { sendMessage } from '../UserInput/UserInputSlice'

export const ImprovementsEnum = {
  HTTP: 'HTTP',
  WEBSOCKET: 'WebSocket'
}

export const TestSuitesEnum = {
  NO_AUTO_QUERIES: 'No Auto Queries',
  RUN_10_QUERIES: 'Run 10 queries',
  RUN_50_QUERIES: 'Run 50 queries'
}

export const generateSessionId = () => {
  return Math.random().toString()
}

const initialState = {
  improvement: 'HTTP',
  testSuite: 'NO_AUTO_QUERIES',
  sessionId: generateSessionId(),
  useLLM: true
}

const experimentConfigSlice = createSlice({
  name: 'experimentConfig',
  initialState,
  reducers: {
    setImprovement(state, action) {
      state.improvement = action.payload
      state.sessionId = generateSessionId()
    },
    
    setTestSuite(state, action) {
      state.testSuite = state.testSuite
    },

    setUseLLM(state, action) {
      state.useLLM = action.payload === "true"
    }
  },
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { setImprovement, setTestSuite, setUseLLM } = experimentConfigSlice.actions

export const selectImprovement = state => state.experimentConfig.improvement
export const selectTestSuite = state => state.experimentConfig.testSuite
export const selectSessionId = state => state.experimentConfig.sessionId
export const selectUseLLM = state => state.experimentConfig.useLLM

// Export the slice reducer as the default export
export default experimentConfigSlice.reducer