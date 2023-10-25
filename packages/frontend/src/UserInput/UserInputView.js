import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import { useDispatch } from 'react-redux'; 
import { sendMessage } from './UserInputSlice'
import './UserInputView.css';

export function UserInputView() {
    const dispatch = useDispatch()
    return (
        <FluentThemeProvider>
            <div className='user-input-view'>
                <SendBox
                    onSendMessage={async (message) => {
                        const formattedMessage = {
                            messageType: 'chat',
                            senderId: 'user',
                            senderDisplayName: 'User',
                            messageId: Math.random().toString(),
                            content: message,
                            // TODO: Have all dates in unix time until display
                            // createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
                            mine: true,
                            attached: false,
                            status: 'seen',
                            contentType: 'html'
                          }
                        dispatch(sendMessage(formattedMessage))
                    }}
                    onTyping={async () => {
                        return;
                    }}
                />
            </div>
        </FluentThemeProvider>
    )
}