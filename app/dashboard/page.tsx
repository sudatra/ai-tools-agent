import { BotIcon } from 'lucide-react'
import React from 'react'

const DashboardPage = () => {
  return (
    <div className='flex flex-1 items-center justify-center p-4'>
      <div className='relative max-2xl w-full'>
        <div className='absolute inset-0 -z-10 bg-gradient-to-r from-gray-100 to-gray-50/50 rounded-3xl' />
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px, transparent_1px),
        linear-gradient(to_bottom,#f5f5f5_1px, transparent_1px)] bg-[size:4rem_4rem] rounded-3xl' />  
        <div className='relative space-y-6 p-8 text-center'>
          <div className='bg-white/60 backdrop-blur-sm shadow-sm ring-1 ring-gray-200/50 rounded-2xl p-6 space-y-4'>
            <div className='bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 inline-flex'>
              <BotIcon className='size-12 text-gray-600' />
            </div>

            <h2 className='text-2xl font-semibold bg-gradient-to-br from-gray-900 to-gray-600 
            bg-clip-text text-transparent'>
              Welcome to Agent&apos;s Chat
            </h2>

            <p className='text-gray-600 max-w-md mx-auto'>Start a New Conversation or Pick an existing chat of yours</p>
            <div className='pt-2 flex justify-center gap-4 text-sm text-gray-500'>
              <div className='flex items-center gap-1.5'>
                <div className='size-2 rounded-full bg-blue-600' />
                Real-time Responses
              </div>

              <div className='flex items-center gap-1.5'>
                <div className='size-2 rounded-full bg-green-600' />
                Smart Assistance
              </div>

              <div className='flex items-center gap-1.5'>
                <div className='size-2 rounded-full bg-purple-600' />
                Powerful Tools
              </div>
            </div>
          </div>          
        </div>      
      </div>
    </div>
  )
}

export default DashboardPage
