import React from 'react'
import { Button } from "@/components/ui/button"

interface Tool {
  id: string;
  name: string;
  description: string;
}

// Liste des outils d'analyse de données
const tools: Tool[] = [
  { id: 'csv-analyzer', name: 'CSV Data Analyzer', description: 'Analyze and visualize CSV data' },
  { id: 'lead-scoring', name: 'Lead Scoring Tool', description: 'Score and prioritize sales leads' },
  { id: 'market-trends', name: 'Market Trends Analyzer', description: 'Identify and analyze market trends' },
  { id: 'predictive-analytics', name: 'Predictive Analytics', description: 'Forecast future trends based on historical data' },
]

interface DataAnalysisToolsProps {
  searchTerm: string;
}

export const DataAnalysisTools: React.FC<DataAnalysisToolsProps> = ({ searchTerm }) => {
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
