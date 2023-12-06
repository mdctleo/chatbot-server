import "./ConversationView.css"
import React, { useEffect } from 'react';
import { MessageThreadView } from '../MessageThread/MessageThreadView';
import { UserInputView } from '../UserInput/UserInputView';

export function ConversationView() {
    useEffect(() => {
      const setVh = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      };
  
      window.addEventListener('resize', setVh);
      setVh(); // Initial set
  
      return () => {
        window.removeEventListener('resize', setVh);
      };
        
    }, [])

    return (
      <>
        <MessageThreadView />
        <UserInputView />
        </>
    );
}