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

const initialState = {
  improvement: 'WEBSOCKET',
  testSuite: 'NO_AUTO_QUERIES'
}

const experimentConfigSlice = createSlice({
  name: 'experimentConfig',
  initialState,
  reducers: {
    setImprovement(state, action) {
      state.improvement = action.payload
    },
    
    setTestSuite(state, action) {
      state.testSuite = state.testSuite
    }
  },
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { setImprovement, setTestSuite } = experimentConfigSlice.actions

export const selectImprovement = state => state.experimentConfig.improvement
export const selectTestSuite = state => state.experimentConfig.testSuite

// Export the slice reducer as the default export
export default experimentConfigSlice.reducer