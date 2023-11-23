import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import "./ExperimentConfigView.css"

export function ExperimentConfigView() {

    return (
        <FluentThemeProvider className="message-thread-view">
          <fluent-select title="Improvements">
            <fluent-option value="1">WebSocket</fluent-option>
            <fluent-option value="2">HTTP</fluent-option>
            <fluent-option value="3">End</fluent-option>
          </fluent-select>
          <fluent-select title="Test Suites">
            <fluent-option value="1">Nothing</fluent-option>
            <fluent-option value="2">Run 50 queries</fluent-option>
            <fluent-option value="3">Run 100 queries</fluent-option>
          </fluent-select>
        </FluentThemeProvider>
    );
}