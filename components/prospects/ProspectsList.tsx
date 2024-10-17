'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Calendar } from 'lucide-react'

interface Prospect {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  status: string
  provider: string
}

interface ProspectsListProps {
  prospects: Prospect[]
  searchTerm: string
}

export default function ProspectsList({ prospects, searchTerm }: ProspectsListProps) {
  const [filteredProspects, setFilteredProspects] = useState(prospects)

  useEffect(() => {
    const filtered = prospects.filter(prospect =>
      Object.values(prospect).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredProspects(filtered)
  }, [prospects, searchTerm])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProspects.map((prospect) => (
          <TableRow key={prospect.id}>
            <TableCell>{`${prospect.first_name} ${prospect.last_name}`}</TableCell>
            <TableCell>{prospect.email}</TableCell>
            <TableCell>{prospect.phone}</TableCell>
            <TableCell>{prospect.address}</TableCell>
            <TableCell>{prospect.status}</TableCell>
            <TableCell>{prospect.provider}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline"><Mail className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline"><Phone className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline"><Calendar className="h-4 w-4" /></Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Prospect Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <h3 className="font-semibold">Personal Information</h3>
                        <p>Name: {`${prospect.first_name} ${prospect.last_name}`}</p>
                        <p>Email: {prospect.email}</p>
                        <p>Phone: {prospect.phone}</p>
                        <p>Address: {prospect.address}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Notes</h3>
                        <Textarea placeholder="Add notes here..." />
                      </div>
                      <div>
                        <h3 className="font-semibold">Interaction History</h3>
                        {/* Add interaction history component here */}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
