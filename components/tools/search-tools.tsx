import React from 'react'
import { Button } from "@/components/ui/button"

interface Tool {
  id: string;
  name: string;
  description: string;
}

// Liste des outils de recherche
const tools: Tool[] = [
  { id: 'serper-api', name: 'Serper API Search', description: 'Perform advanced web searches using Serper API' },
  { id: 'custom-google-search', name: 'Custom Google Search', description: 'Create and use custom Google search engines' },
  { id: 'academic-search', name: 'Academic Search', description: 'Search academic papers and publications' },
  { id: 'social-media-search', name: 'Social Media Search', description: 'Search across multiple social media platforms' },
]

interface SearchToolsProps {
  searchTerm: string;
}

export const SearchTools: React.FC<SearchToolsProps> = ({ searchTerm }) => {
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
