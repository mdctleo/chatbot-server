import { useSelector } from 'react-redux'
import { selectMessages } from './MessageThreadSlice'
import { MessageThread } from '@azure/communication-react';
import "./MessageThreadView.css"

export function MessageThreadView() {
    const messages = useSelector(selectMessages)

    return (
        <MessageThread className="message-thread-view" userId={'1'} showMessageDate={true} messages={ messages } />
    );
}