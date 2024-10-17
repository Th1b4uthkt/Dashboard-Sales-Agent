import React from 'react'
import { Button } from "@/components/ui/button"

interface Tool {
  id: string;
  name: string;
  description: string;
}

// Liste des outils de productivité
const tools: Tool[] = [
  { id: 'task-automator', name: 'Task Automator', description: 'Automate repetitive tasks and workflows' },
  { id: 'calendar-optimizer', name: 'Calendar Optimizer', description: 'Optimize your schedule for maximum productivity' },
  { id: 'note-taker', name: 'Smart Note Taker', description: 'Take and organize notes efficiently' },
  { id: 'time-tracker', name: 'Time Tracking Tool', description: 'Track and analyze your time usage' },
]

interface ProductivityToolsProps {
  searchTerm: string;
}

export const ProductivityTools: React.FC<ProductivityToolsProps> = ({ searchTerm }) => {
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
