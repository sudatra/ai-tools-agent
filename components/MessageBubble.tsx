'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useUser } from '@clerk/nextjs';
import { BotIcon } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

const formatMessage = (content: string): string => {
  content = content.replace(/\\\\/g, '\\');
  content = content.replace(/\\n/g, '\n');
  content = content.replace(/---START---\n?/g, '').replace(/\n?---END---/g, '');

  return content.trim();
}

const MessageBubble = ({ content, isUser }: MessageBubbleProps) => {
  const { user } = useUser();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${isUser ? 'bg-blue-600 text-white rounded-br-none ring-blue-700' : 'bg-white text-gray-900 rounded-bl-none ring-gray-700'}
      rounded-2xl px-4 py-2.5 max-w-[85%] md:max-w-[75%] shadow-sm ring-1 ring-inset relative`}>
        <div className='whitespace-pre-wrap text-[15px] leading-relaxed'>
          <div dangerouslySetInnerHTML={{ __html: formatMessage(content) }} />
        </div>

        <div className={`absolute bottom-0 translate-y-1/2 ${isUser ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}>
          <div className={`size-8 rounded-full border-2 ${isUser ? 'bg-white border-gray-100' : 'bg-blue-600 border-white'}
          flex items-center justify-center shadow-sm`}>
            {
              isUser ? (
                <Avatar className='size-7'>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <BotIcon className='size-5 text-white' />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
