import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";

export const getLLMResponse = async (query : string) => {
    const llm = new OpenAI({
        temperature: 0.9,
    });

    const template = "You are a helpful AI assistant that attempts to answer or assist with the user's question or task in the most efficient and concise way";
    const humanTemplate = "{text}";

    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", template],
        ["human", humanTemplate],
    ]);
    
    const model = new ChatOpenAI({});
    
    const chain = chatPrompt.pipe(model).pipe(new StringOutputParser());
    
    const result = await chain.invoke({
      text: query,
    })

    return result;
}