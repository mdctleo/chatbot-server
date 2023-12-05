import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import { useDispatch } from 'react-redux'; 
import { sendMessage } from './UserInputSlice'
import { selectImprovement, selectSessionId, selectUseLLM } from '../ExperimentConfig/ExperimentConfigSlice'
import { store } from '../index'
import './UserInputView.css';

export function UserInputView() {
    const dispatch = useDispatch()
    return (
        <FluentThemeProvider>
            <div className='user-input-view'>
                <SendBox
                    onSendMessage={async (message) => {
                        const messagePayload = {
                            // This message object is the format the UI library expects
                            // We should add our fields outside the message object so it will easy to extract and display
                            message: {
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
                          }
                        const improvement = selectImprovement(store.getState())
                        const sessionId = selectSessionId(store.getState())
                        const useLLM = selectUseLLM(store.getState())
                        dispatch(sendMessage({messagePayload: messagePayload, improvement: improvement, sessionId: sessionId, useLLM: useLLM}))
                    }}
                    onTyping={async () => {
                        return;
                    }}
                />
            </div>
        </FluentThemeProvider>
    )
}