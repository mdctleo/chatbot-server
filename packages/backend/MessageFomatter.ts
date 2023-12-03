// {
//     messageType: 'chat',
//     senderId: 'user1',
//     senderDisplayName: 'Kat Larsson',
//     messageId: Math.random().toString(),
//     content: 'Hi everyone, I created this awesome group chat for us!',
//     createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
//     mine: true,
//     attached: false,
//     status: 'seen',
//     contentType: 'html'
//   }

// TODO: This can be a common class shared by both backend and frontend that takes a string and formats it into this format

/**
 * From communication-react.d.ts
 */
interface MessageFormat {
    sessionId: string;
    exchangeId: string;
    improvement: string;
    message: {
        messageId: string;
        createdOn?: Date;
        messageType: 'chat';
        content?: string;
        editedOn?: Date;
        deletedOn?: Date;
        senderId?: string;
        senderDisplayName?: string;
        failureReason?: string;
        mine?: boolean;
        clientMessageId?: string;
        contentType: 'text' | 'html' | 'richtext/html' | 'unknown';
        /**
        * A metadata field for the message.
        * {@link @azure/communication-chat#ChatMessage.metadata}
        */
        metadata?: Record<string, string>;
    }
}


export const generateFakePlaceHolderMessages = (response: string, sessionId: string, exchangeId: string, improvement: string) : MessageFormat => {
    return {
        sessionId: sessionId,
        exchangeId: exchangeId,
        improvement: improvement,
        message: {
            messageId: Math.random().toString(),
            // TODO: Fix this, have all dates in unix time until display
            // createdOn: "2021-01-01",
            messageType: 'chat',
            content: response,
            contentType: 'text',
            senderId: 'LLM',
            senderDisplayName: 'LLM',
            mine: false,
        }
    }
}