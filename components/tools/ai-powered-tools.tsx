import React from 'react'
import { Button } from "@/components/ui/button"

interface Tool {
  id: string;
  name: string;
  description: string;
}

// Liste des outils alimentés par l'IA
const tools: Tool[] = [
  { id: 'ai-writer', name: 'AI Content Writer', description: 'Generate high-quality content using AI' },
  { id: 'chatbot-creator', name: 'AI Chatbot Creator', description: 'Build intelligent chatbots with AI' },
  { id: 'image-generator', name: 'AI Image Generator', description: 'Create unique images using AI' },
  { id: 'voice-assistant', name: 'AI Voice Assistant', description: 'Develop custom voice assistants powered by AI' },
]

interface AIPoweredToolsProps {
  searchTerm: string;
}

export const AIPoweredTools: React.FC<AIPoweredToolsProps> = ({ searchTerm }) => {
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
