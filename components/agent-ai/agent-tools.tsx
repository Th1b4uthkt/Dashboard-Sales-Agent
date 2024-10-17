import React from 'react'
import { Button } from "@/components/ui/button"
import { Phone, MessageSquare, Search, Globe, Database } from 'lucide-react'

export function AgentTools() {
  const tools = [
    { name: 'Phone', icon: Phone },
    { name: 'SMS', icon: MessageSquare },
    { name: 'Embedding', icon: Database },
    { name: 'Scraping', icon: Search },
    { name: 'Web Search', icon: Globe },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {tools.map((tool) => (
        <Button key={tool.name} variant="outline" className="flex items-center justify-start space-x-2">
          <tool.icon className="h-4 w-4" />
          <span>{tool.name}</span>
        </Button>
      ))}
    </div>
  )
}
