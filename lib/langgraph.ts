import { ChatAnthropic } from '@langchain/anthropic';

const initializeAnthropicModel = () => {
  const model = new ChatAnthropic({
    model: 'claude-3-5-sonnet-20241022',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY
  })
}