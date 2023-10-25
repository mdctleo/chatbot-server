import { useSelector } from 'react-redux'
import { selectMessages } from './MessageThreadSlice'
import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import "./MessageThreadView.css"

export function MessageThreadView() {
    const messages = useSelector(selectMessages)

    return (
        <FluentThemeProvider className="message-thread-view">
          <MessageThread userId={'1'} showMessageDate={true} messages={ messages } />
        </FluentThemeProvider>
    );
}