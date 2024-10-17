'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { WebScrapingTools } from '@/components/tools/web-scraping-tools'
import { SearchTools } from '@/components/tools/search-tools'
import { DataAnalysisTools } from '@/components/tools/data-analysis-tools'
import { CommunicationTools } from '@/components/tools/communication-tools'
import { AIPoweredTools } from '@/components/tools/ai-powered-tools'
import { ProductivityTools } from '@/components/tools/productivity-tools'

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Tools</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tools..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white/10 text-white">
          <CardHeader>
            <CardTitle>Web Scraping Tools</CardTitle>
            <CardDescription>Extract data from websites</CardDescription>
          </CardHeader>
          <CardContent>
            <WebScrapingTools searchTerm={searchTerm} />
          </CardContent>
        </Card>

        <Card className="bg-white/10 text-white">
          <CardHeader>
            <CardTitle>Search Tools</CardTitle>
            <CardDescription>Find information quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchTools searchTerm={searchTerm} />
          </CardContent>
        </Card>

        <Card className="bg-white/10 text-white">
          <CardHeader>
            <CardTitle>Data Analysis Tools</CardTitle>
            <CardDescription>Analyze and visualize data</CardDescription>
          </CardHeader>
          <CardContent>
            <DataAnalysisTools searchTerm={searchTerm} />
          </CardContent>
        </Card>

        <Card className="bg-white/10 text-white">
          <CardHeader>
            <CardTitle>Communication Tools</CardTitle>
            <CardDescription>Enhance your outreach</CardDescription>
          </CardHeader>
          <CardContent>
            <CommunicationTools searchTerm={searchTerm} />
          </CardContent>
        </Card>

        <Card className="bg-white/10 text-white">
          <CardHeader>
            <CardTitle>AI-Powered Tools</CardTitle>
            <CardDescription>Leverage artificial intelligence</CardDescription>
          </CardHeader>
          <CardContent>
            <AIPoweredTools searchTerm={searchTerm} />
          </CardContent>
        </Card>

        <Card className="bg-white/10 text-white">
          <CardHeader>
            <CardTitle>Productivity Tools</CardTitle>
            <CardDescription>Optimize your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductivityTools searchTerm={searchTerm} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
