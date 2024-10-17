'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Mail, Trash, Forward, Reply } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

// Mock data for emails
const emails = [
  { id: 1, sender: 'John Doe', subject: 'Meeting Tomorrow', date: '2023-10-01', status: 'unread' },
  { id: 2, sender: 'Jane Smith', subject: 'Project Update', date: '2023-09-30', status: 'read' },
  // Add more mock emails...
]

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmails, setSelectedEmails] = useState<number[]>([])
  const [selectedEmail, setSelectedEmail] = useState<typeof emails[0] | null>(null)

  const filteredEmails = emails.filter(email =>
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Messages</h2>
      
      {/* Search and bulk actions */}
      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Mark as Read
          </Button>
          <Button variant="outline" size="sm">
            Mark as Unread
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      </div>

      {/* Email table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedEmails.length === filteredEmails.length}
                onCheckedChange={(checked) => {
                  setSelectedEmails(checked ? filteredEmails.map(e => e.id) : [])
                }}
              />
            </TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmails.map((email) => (
            <TableRow key={email.id}>
              <TableCell>
                <Checkbox
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={(checked) => {
                    setSelectedEmails(
                      checked
                        ? [...selectedEmails, email.id]
                        : selectedEmails.filter(id => id !== email.id)
                    )
                  }}
                />
              </TableCell>
              <TableCell>{email.sender}</TableCell>
              <TableCell>{email.subject}</TableCell>
              <TableCell>{email.date}</TableCell>
              <TableCell>{email.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" onClick={() => setSelectedEmail(email)}>View</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>{selectedEmail?.subject}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">From:</span>
                        <span className="col-span-3">{selectedEmail?.sender}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Date:</span>
                        <span className="col-span-3">{selectedEmail?.date}</span>
                      </div>
                      <Textarea
                        placeholder="Email content..."
                        value="This is the content of the email..."
                        readOnly
                      />
                      <div className="space-y-2">
                        <h4 className="font-semibold">AI Actions</h4>
                        <Button className="w-full justify-start">
                          <Mail className="mr-2 h-4 w-4" />
                          Summarize Email
                        </Button>
                        <Button className="w-full justify-start">
                          <Reply className="mr-2 h-4 w-4" />
                          Suggest Auto-Reply
                        </Button>
                        <Button className="w-full justify-start">
                          <Forward className="mr-2 h-4 w-4" />
                          Create Task from Email
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Mark as {email.status === 'read' ? 'Unread' : 'Read'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Reply className="mr-2 h-4 w-4" />
                      <span>Reply</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="mr-2 h-4 w-4" />
                      <span>Forward</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
