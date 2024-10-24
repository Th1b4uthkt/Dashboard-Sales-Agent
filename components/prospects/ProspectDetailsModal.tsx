'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Prospect } from '@/types/prospect'
import { MultiSelect } from "@/components/ui/multi-select"

interface ProspectDetailsModalProps {
  prospect: Prospect
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedProspect: Prospect) => void
}

export function ProspectDetailsModal({ prospect, isOpen, onClose, onUpdate }: ProspectDetailsModalProps) {
  const [editedProspect, setEditedProspect] = useState<Prospect>(prospect)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProspect({ ...editedProspect, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedProspect({ ...editedProspect, [name]: value })
  }

  const handleTagChange = (tagNames: string[]) => {
    const updatedTags = tagNames.map(name => {
      const existingTag = editedProspect.tags.find(tag => tag.name === name);
      if (existingTag) {
        return existingTag;
      } else {
        // Utilisez un ID temporaire pour les nouveaux tags
        return { id: `temp_${Date.now()}_${name}`, name };
      }
    });
    setEditedProspect({ ...editedProspect, tags: updatedTags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(editedProspect)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Prospect Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={editedProspect.first_name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={editedProspect.last_name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editedProspect.email}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country_code" className="text-right">Country Code</Label>
            <Select
              name="country_code"
              onValueChange={(value) => handleSelectChange('country_code', value)}
              defaultValue={editedProspect.country_code}
            >
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
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={editedProspect.phone}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Address</Label>
            <Input
              id="address"
              name="address"
              value={editedProspect.address}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select
              name="status"
              onValueChange={(value) => handleSelectChange('status', value)}
              defaultValue={editedProspect.status}
            >
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
            <Input
              id="provider"
              name="provider"
              value={editedProspect.provider}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">Tags</Label>
            <MultiSelect
              className="col-span-3"
              placeholder="Select or create tags"
              selected={editedProspect.tags.map(tag => tag.name)}
              onChange={handleTagChange}
              createable={true}
            />
          </div>
          <Button type="submit" className="mt-4">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
