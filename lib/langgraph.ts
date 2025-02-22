import { ChatAnthropic } from '@langchain/anthropic';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import wxflows from '@wxflows/sdk/langchain';
import { START, END, MessagesAnnotation, StateGraph, MemorySaver } from '@langchain/langgraph';
import SYSTEM_MESSAGE from '@/constants/systemMessage';
import { AIMessage, BaseMessage, HumanMessage, SystemMessage, trimMessages } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

const trimmer = trimMessages({
  maxTokens: 10,
  strategy: 'last',
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: 'human'
});

const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || '',
  apikey: process.env.WXFLOWS_API_KEY
});

const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

const initializeAnthropicModel = () => {
  const model = new ChatAnthropic({
    model: 'claude-3-5-sonnet-20241022',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    temperature: 0.7,
    maxTokens: 4096,
    streaming: true,
    clientOptions: {
      defaultHeaders: { 'anthropic-beta': 'prompt-caching-2024-07-31' }
    },
    callbacks: [
      {
        handleLLMStart: async () => {
          console.log("Starting LLM");
        },
        handleLLMEnd: async () => {
          console.log("End LLM Call");
        }
      }
    ]
  })
  .bindTools(tools);

  return model;
}

const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if(lastMessage.tool_calls?.length) {
    return 'tools';
  }

  if(lastMessage.content && lastMessage._getType() === 'tool') {
    return 'agent';
  }

  return END;
}

const createWorkflow = () => {
  const model = initializeAnthropicModel();
  const stateGraph = new StateGraph(MessagesAnnotation)
  .addNode('agent', async (state) => {
    const systemContent = SYSTEM_MESSAGE;
    const promptTemplate = ChatPromptTemplate.fromMessages([
      new SystemMessage(systemContent, {
        cache_control: { type: 'ephemeral' }
      }),
      new MessagesPlaceholder('messages')
    ]);

    const trimmedMessages = await trimmer.invoke(state.messages);
    const prompt = await promptTemplate.invoke({ messages: trimmedMessages });
    const response = await model.invoke(prompt);

    return { messages: [response] };
  })
  .addEdge(START, 'agent')
  .addNode('tools', toolNode)
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent');

  return stateGraph;
}

const addCachingHeaders = (messages: BaseMessage[]): BaseMessage[] => {
  if(!messages.length) {
    return messages;
  }

  const cachedMessages = [...messages];
  const addCache = (message: BaseMessage) => {
    message.content = [
      {
        type: 'text',
        text: message.content as string,
        cache_control: { type: 'ephemeral' }
      }
    ]
  }

  addCache(cachedMessages.at(-1)!);

  let humanMessageCount = 0;
  for(let i = cachedMessages.length - 1; i >= 0; i--) {
    if(cachedMessages[i] instanceof HumanMessage) {
      humanMessageCount++;
    }

    if(humanMessageCount === 2) {
      addCache(cachedMessages[i]);
      break;
    }
  }

  return cachedMessages;
}

export const submitQuestion = async (messages: BaseMessage[], chatId: string) => {
  const cachedMessages = addCachingHeaders(messages);
  const workflow = createWorkflow();
  const checkpointer = new MemorySaver();

  const app = workflow.compile({ checkpointer });
  const stream = await app.streamEvents(
    { messages: cachedMessages },
    {
      version: 'v2',
      configurable: {
        thread_id: chatId
      },
      streamMode: 'messages',
      runId: chatId
    }
  );

  return stream;
}