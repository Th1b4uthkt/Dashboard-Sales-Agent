'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { z } from 'zod'
import { User as UserIcon, Phone, Mail } from 'lucide-react'

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
})

export function ProfileSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setProfile({
          full_name: user.user_metadata.full_name || '',
          phone: user.phone || '',
        })
      }
      setIsLoading(false)
    }

    loadProfile()
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      profileSchema.parse(profile)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" })
        return
      }
    }

    setIsLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({
      phone: profile.phone,
      data: { full_name: profile.full_name }
    })

    if (updateError) {
      toast({ title: "Error updating profile", description: updateError.message, variant: "destructive" })
    } else {
      toast({ title: "Profile updated successfully" })
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="full_name" className="flex items-center">
          <UserIcon className="mr-2 h-4 w-4" />
          Full Name
        </Label>
        <Input
          type="text"
          id="full_name"
          name="full_name"
          value={profile.full_name}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email" className="flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={user?.email || ''}
          disabled
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="phone" className="flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          Phone
        </Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={profile.phone}
          onChange={handleInputChange}
        />
      </div>
      <Button onClick={handleSave} disabled={isLoading}>Save Profile</Button>
    </div>
  )
}
