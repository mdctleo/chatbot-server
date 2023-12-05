import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

export const getLLMResponse = (query : string) => {
    const llm = new OpenAI({
        temperature: 0.9,
    });
    const chatModel = new ChatOpenAI();

    return llm.predict(query);
}