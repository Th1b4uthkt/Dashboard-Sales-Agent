'use client';

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AgentConversation } from '@/components/agent-ai/agent-conversation'
import { AgentNotifications } from '@/components/agent-ai/agent-notifications'
// Imports commentés pour les composants non utilisés actuellement
// import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui"
// import { ScrollArea } from "@/components/ui"
// import { getEvents } from '@/lib/events'
// import { AgentTools } from '@/components/agent-ai/agent-tools'

import { AgentConversationProps } from '@/components/agent-ai/agent-conversation';

type ConversationMessage = NonNullable<AgentConversationProps['conversation']>[number];
type Notification = React.ComponentProps<typeof AgentNotifications>['notifications'][number];

interface Conversation {
  id: string;
  messages: ConversationMessage[];
  // Autres propriétés de la conversation si nécessaire
}

export default function AgentAIPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchConversations();
    fetchNotifications();
  }, []);

  const fetchConversations = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setConversations(data as Conversation[])
      if (data.length > 0) {
        setCurrentConversation(data[0])
      }
    }
  }

  const fetchNotifications = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setNotifications(data as Notification[])
  }

  const handleNewMessage = (message: string) => {
    if (currentConversation) {
      const newMessage: ConversationMessage = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date().toISOString(),
        sender: 'user',
      };

      setCurrentConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      });

      // Logique pour envoyer le message au backend
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-200">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        {conversations.map(conv => (
          <div 
            key={conv.id} 
            className="cursor-pointer p-2 hover:bg-gray-300"
            onClick={() => setCurrentConversation(conv)}
          >
            Conversation {conv.id}
          </div>
        ))}
      </div>
      <div className="flex-1 p-4">
        <AgentConversation 
          conversation={currentConversation?.messages || null} 
          onNewMessage={handleNewMessage}
        />
      </div>
      <div className="w-1/4 p-4 bg-gray-100">
        <AgentNotifications notifications={notifications} />
      </div>
    </div>
  );
}
