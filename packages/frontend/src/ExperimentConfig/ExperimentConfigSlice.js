import { createSlice } from '@reduxjs/toolkit'
import { closeWebSocket, initializeWebSocket } from '../WebSocketHandler'
import { freeWebrtcResource, initializeWebrtcSocket } from '../WebRTCHandler'

export const ImprovementsEnum = {
  HTTP: 'HTTP',
  WEBSOCKET: 'WebSocket',
  WEBRTC: "WebRTC"
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

      if (state.improvement === "WEBSOCKET") {
        // freeWebrtcResource()

        initializeWebSocket()
      } else if (state.improvement === "HTTP") {
        closeWebSocket()
        // freeWebrtcResource()
      } else if (state.improvement === "WEBRTC") {
        // closeWebSocket()
        
        initializeWebrtcSocket()
      }
    },
    
    setTestSuite(state, action) {
      state.testSuite = action.payload
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