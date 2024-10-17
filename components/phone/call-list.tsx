import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CallDetails } from "./call-details"
import { CallActions } from "./call-actions"
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Call } from '@/types/call'

interface CallListProps {
  calls: Array<Omit<Call, 'status'> & { status: string }>
}

export function CallList({ calls }: CallListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>Date/Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.id}>
            <TableCell>
              {call.type === 'incoming' ? 
                <ArrowDownLeft className="h-4 w-4 text-green-500" /> : 
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
              }
            </TableCell>
            <TableCell>{call.number}</TableCell>
            <TableCell>{call.date}</TableCell>
            <TableCell>{call.duration}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <CallDetails call={call as Call} />
                <CallActions call={call as Call} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
