'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from 'lucide-react'
import { addProspect } from '@/app/actions/prospects'
import { MultiSelect } from "@/components/ui/multi-select"

export default function ProspectForm() {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])  // Initialiser avec un tableau vide
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    // Ajouter les tags seulement s'ils existent
    if (tags && tags.length > 0) {
      tags.forEach(tag => formData.append('tags', tag))
    }
    
    const result = await addProspect(formData)
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      console.error(result.error)
    }
  }

  // Ajoutez cette fonction pour gérer les nouveaux tags
  const handleTagChange = (newTags: string[]) => {
    setTags(newTags);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Prospect</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Prospect</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <Input id="firstName" name="firstName" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Last Name</Label>
            <Input id="lastName" name="lastName" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" name="email" type="email" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="countryCode" className="text-right">Country Code</Label>
            <Select name="countryCode" defaultValue="+33">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select country code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+33">France (+33)</SelectItem>
                <SelectItem value="+66">Thailand (+66)</SelectItem>
                <SelectItem value="+7">Russia (+7)</SelectItem>
                <SelectItem value="+32">Belgium (+32)</SelectItem>
                <SelectItem value="+1">USA/Canada (+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" name="phone" type="tel" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Address</Label>
            <Input id="address" name="address" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select name="status" defaultValue="New">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">Provider</Label>
            <Input id="provider" name="provider" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">Tags</Label>
            <MultiSelect
              className="col-span-3"
              placeholder="Type a tag and press Enter"
              selected={tags}
              onChange={handleTagChange}
              createable={true}
            />
          </div>
          <Button type="submit" className="mt-4">Save Prospect</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
