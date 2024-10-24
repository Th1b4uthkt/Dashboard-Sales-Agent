'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/utils/supabase/client'

export function APIKeySettings() {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    serper: '',
    retell: '',
  })
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchApiKeys = async () => {
      const { data } = await supabase
        .from('user_settings')
        .select('api_keys')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (data) {
        setApiKeys(data.api_keys)
      }
    }

    fetchApiKeys()
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys({ ...apiKeys, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('user_settings')
      .upsert({ user_id: (await supabase.auth.getUser()).data.user?.id, api_keys: apiKeys })

    if (error) {
      toast({ title: "Error saving API keys", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "API keys saved successfully" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="openai">OpenAI API Key</Label>
        <Input
          type="password"
          id="openai"
          name="openai"
          value={apiKeys.openai}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="serper">Serper API Key</Label>
        <Input
          type="password"
          id="serper"
          name="serper"
          value={apiKeys.serper}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="retell">Retell API Key</Label>
        <Input
          type="password"
          id="retell"
          name="retell"
          value={apiKeys.retell}
          onChange={handleInputChange}
        />
      </div>
      <Button onClick={handleSave}>Save API Keys</Button>
    </div>
  )
}
