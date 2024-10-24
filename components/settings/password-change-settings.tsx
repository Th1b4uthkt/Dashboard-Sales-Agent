'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/utils/supabase/client'
import { z } from 'zod'
import { Lock } from 'lucide-react'

const passwordSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  new: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirm: z.string()
}).refine((data) => data.new === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export function PasswordChangeSettings() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = async () => {
    try {
      passwordSchema.parse(passwords)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" })
        return
      }
    }

    setIsLoading(true)
    const { error } = await supabase.auth.updateUser({ 
      password: passwords.new
    })

    if (error) {
      toast({ title: "Error changing password", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Password changed successfully" })
      setPasswords({ current: '', new: '', confirm: '' })
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="current" className="flex items-center">
          <Lock className="mr-2 h-4 w-4" />
          Current Password
        </Label>
        <Input
          type="password"
          id="current"
          name="current"
          value={passwords.current}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="new" className="flex items-center">
          <Lock className="mr-2 h-4 w-4" />
          New Password
        </Label>
        <Input
          type="password"
          id="new"
          name="new"
          value={passwords.new}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="confirm" className="flex items-center">
          <Lock className="mr-2 h-4 w-4" />
          Confirm New Password
        </Label>
        <Input
          type="password"
          id="confirm"
          name="confirm"
          value={passwords.confirm}
          onChange={handleInputChange}
        />
      </div>
      <Button onClick={handlePasswordChange} disabled={isLoading}>Change Password</Button>
    </div>
  )
}
