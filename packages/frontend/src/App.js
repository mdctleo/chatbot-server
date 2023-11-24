import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConversationView } from "./Conversation/ConversationView";
import { ExperimentConfigView } from "./ExperimentConfig/ExperimentConfigView";
import { FluentThemeProvider } from "@azure/communication-react";
import { HeaderView } from "./Header/HeaderView";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

function App() {
  return (
    <FluentThemeProvider>
      <FluentProvider theme={teamsLightTheme}>
        <Router>
          <div className="grid-container">
            <HeaderView />
            <Routes>
              <Route path="/" element={<ConversationView />} />
              <Route path="/config" element={<ExperimentConfigView />} />
            </Routes>
          </div>
        </Router>
      </FluentProvider>
    </FluentThemeProvider>
  );
}

export default App;
