import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: string
}

export interface AgentConversationProps {
  conversation: Message[] | null
  onNewMessage: (message: string) => void
}

export function AgentConversation({ conversation, onNewMessage }: AgentConversationProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onNewMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-grow mb-4">
        {conversation && conversation.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
          </div>
        ))}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  )
}
