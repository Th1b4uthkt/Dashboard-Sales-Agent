'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Settings, Tag } from 'lucide-react'
import ReactCountryFlag from "react-country-flag"
import { Prospect, Tag as TagType } from '@/types/prospect'
import { ProspectDetailsModal } from './ProspectDetailsModal'

interface ProspectsListProps {
  prospects: Prospect[]
  searchTerm: string
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    New: "bg-green-500",
    Contacted: "bg-blue-500",
    Qualified: "bg-yellow-500",
    Lost: "bg-red-500",
  }

  return (
    <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white`}>
      {status}
    </Badge>
  )
}

const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  const isoCode = getISOCode(countryCode);
  
  return (
    <div className="flex items-center">
      <ReactCountryFlag
        countryCode={isoCode}
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
        }}
        title={isoCode}
      />
      <span className="ml-2">{countryCode}</span>
    </div>
  );
};

const getISOCode = (phoneCode: string): string => {
  const codeMap: { [key: string]: string } = {
    '+33': 'FR',
    '+66': 'TH',
    '+7': 'RU',
    '+32': 'BE',
    '+1': 'US',
  };
  return codeMap[phoneCode] || 'UN';
};

export default function ProspectsList({ prospects, searchTerm }: ProspectsListProps) {
  const [filteredProspects, setFilteredProspects] = useState(prospects)
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const filtered = prospects.filter(prospect =>
      Object.values(prospect).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) || prospect.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredProspects(filtered)
  }, [prospects, searchTerm])

  const handleUpdateProspect = (updatedProspect: Prospect) => {
    setFilteredProspects(prevProspects => 
      prevProspects.map(p => p.id === updatedProspect.id ? updatedProspect : p)
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-800 to-gray-900">
            <TableHead className="text-white font-bold">
              <span className="flex items-center">
                <User className="mr-2 h-4 w-4" /> Name
              </span>
            </TableHead>
            <TableHead className="text-white font-bold">
              <span className="flex items-center">
                <Mail className="mr-2 h-4 w-4" /> Contact
              </span>
            </TableHead>
            <TableHead className="text-white font-bold">
              <span className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> Country
              </span>
            </TableHead>
            <TableHead className="text-white font-bold">
              <span className="flex items-center">
                <Badge className="mr-2 h-4 w-4" /> Status
              </span>
            </TableHead>
            <TableHead className="text-white font-bold">
              <span className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" /> Provider
              </span>
            </TableHead>
            <TableHead className="text-white font-bold">
              <span className="flex items-center">
                <Settings className="mr-2 h-4 w-4" /> Actions
              </span>
            </TableHead>
            <TableHead className="text-white font-bold">
              <span className="flex items-center">
                <Tag className="mr-2 h-4 w-4" /> Tags
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProspects.map((prospect) => (
            <TableRow key={prospect.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{`${prospect.first_name} ${prospect.last_name}`}</p>
                    <p className="text-sm text-muted-foreground">{prospect.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <span className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2" />{prospect.phone}
                  </span>
                  <span className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2" />{prospect.address}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <CountryFlag countryCode={prospect.country_code} />
              </TableCell>
              <TableCell>
                <StatusBadge status={prospect.status} />
              </TableCell>
              <TableCell>{prospect.provider}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline"><Mail className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline"><Phone className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline"><Calendar className="h-4 w-4" /></Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedProspect(prospect)
                      setIsModalOpen(true)
                    }}
                  >
                    Details
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {prospect.tags.map((tag: TagType) => (
                    <Badge key={tag.id} style={{backgroundColor: tag.color}}>{tag.name}</Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedProspect && (
        <ProspectDetailsModal
          prospect={selectedProspect}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateProspect}
        />
      )}
    </div>
  )
}
