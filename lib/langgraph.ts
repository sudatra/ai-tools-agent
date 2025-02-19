import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';

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
        handleLLMEnd: async (output) => {
          console.log("End LLM Call");
          const usage = output.llmOutput?.usage;
        }
      }
    ]
  })

  return model;
}