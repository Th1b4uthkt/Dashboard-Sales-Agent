import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  content: string
  timestamp: string
}

interface AgentNotificationsProps {
  notifications: Notification[]
}

export function AgentNotifications({ notifications }: AgentNotificationsProps) {
  return (
    <ScrollArea className="h-[200px]">
      {notifications.map((notification) => (
        <div key={notification.id} className="mb-2 p-2 bg-secondary rounded-lg">
          <p className="text-sm">{notification.content}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
        </div>
      ))}
    </ScrollArea>
  )
}
