import React from 'react'
import { Button } from "@/components/ui/button"

interface Tool {
  id: string;
  name: string;
  description: string;
}

const tools: Tool[] = [
  { id: 'google-maps-scraper', name: 'Google Maps Scraper', description: 'Extract business data from Google Maps' },
  { id: 'bing-maps-scraper', name: 'Bing Maps Scraper', description: 'Scrape location data from Bing Maps' },
  { id: 'web-scraper', name: 'General Web Scraper', description: 'Extract data from any website' },
]

interface WebScrapingToolsProps {
  searchTerm: string;
}

export const WebScrapingTools: React.FC<WebScrapingToolsProps> = ({ searchTerm }) => {
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
