'use client'

import { Doc, Id } from '@/convex/_generated/dataModel'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { ChatRequestBody } from '@/lib/types';

interface ChatInterfaceProps {
  chatId: Id<'chats'>;
  initialMessages: Doc<'messages'>[];
}

interface ToolProps {
  name: string;
  input: unknown;
}

const ChatInterface = ({ chatId, initialMessages }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Doc<'messages'>[]>(initialMessages);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamedResponses, setStreamedResponses] = useState('');
  const [currentTool, setCurrentTool] = useState<ToolProps | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedResponses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if(!trimmedInput || isLoading) {
      return;
    }

    setInput('');
    setStreamedResponses('');
    setCurrentTool(null);
    setIsLoading(true);

    const optimisticUserMessage: Doc<'messages'> = {
      _id: `temp_${Date.now()}`,
      chatId,
      content: trimmedInput,
      role: 'user',
      createdAt: Date.now(),
    } as Doc<'messages'>;

    setMessages((prev) => [...prev, optimisticUserMessage]);
    let fullResponse = '';

    try {
      const requestBody: ChatRequestBody = {
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content
        })),
        newMessage: trimmedInput,
        chatId
      }

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if(!response.ok) {
        throw new Error(await response.text());
      }

      if(!response.body) {
        throw new Error('No Response Body Available');
      }

      //TODO: Handle stream
    }
    catch(error) {
      console.error('Error Sending Messages', error);
      setMessages((prev) => 
        prev.filter((msg) => msg._id !== optimisticUserMessage._id)
      )

      setStreamedResponses('error');
    }
  }

  return (
    <main className='flex flex-col h-[calc(100vh-theme(spacing.14))]'>
      <section className='flex-1'>
        <div>
          {
            messages.map((message) => (
              <div key={message._id}>
                {message.content}
              </div>
            ))
          }
        </div>

        <div ref={messagesEndRef} />
      </section>

      <footer className='border-t bg-white p-4'>
        <form
          onSubmit={handleSubmit}
          className='max-w-4xl mx-auto relative'
        >
          <div className='relative flex items-center'>
            <input 
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder='Message AI Agent...'
              className='flex-1 py-3 px-4  rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus: ring-blue-500
              focus:border-transparent pr-12 bg-gray-50 placeholder:text-gray-500'
            />

            <Button
              type='submit'
              disabled={isLoading || !input.trim()}
              className={`absolute right-1.5 rounded-xl size-9 m-4 p-0 flex items-center justify-center transition-all cursor-pointer ${
                input.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <ArrowRight />
            </Button>
          </div>
        </form>
      </footer>
    </main>
  )
}

export default ChatInterface
