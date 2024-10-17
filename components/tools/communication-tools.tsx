import React from 'react'
import { Button } from "@/components/ui/button"

interface Tool {
  id: string;
  name: string;
  description: string;
}

// Liste des outils de communication
const tools: Tool[] = [
  { id: 'email-template', name: 'Email Template Generator', description: 'Create professional email templates' },
  { id: 'social-media-post', name: 'Social Media Post Creator', description: 'Design engaging social media posts' },
  { id: 'chatbot-builder', name: 'Chatbot Builder', description: 'Create custom chatbots for customer service' },
  { id: 'video-conferencing', name: 'Video Conferencing Tool', description: 'Host and manage video meetings' },
]

interface CommunicationToolsProps {
  searchTerm: string;
}

export const CommunicationTools: React.FC<CommunicationToolsProps> = ({ searchTerm }) => {
  // Filtrer les outils en fonction du terme de recherche
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {filteredTools.map(tool => (
        <div key={tool.id} className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold">{tool.name}</h3>
          <p className="text-sm text-gray-300 mb-2">{tool.description}</p>
          <Button variant="outline" size="sm">Use Tool</Button>
        </div>
      ))}
    </div>
  )
}
