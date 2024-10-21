'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PhoneNumber {
  id: string;
  number: string;
  status: string;
  nickname: string;
  agentId: string;
}

interface PhoneNumberListProps {
  phoneNumbers: PhoneNumber[];
}

export function PhoneNumberList({ phoneNumbers }: PhoneNumberListProps) {
  if (phoneNumbers.length === 0) {
    return <div>No phone numbers available.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Number</TableHead>
          <TableHead>Nickname</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Agent ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {phoneNumbers.map((phoneNumber) => (
          <TableRow key={phoneNumber.id}>
            <TableCell>{phoneNumber.number}</TableCell>
            <TableCell>{phoneNumber.nickname || 'N/A'}</TableCell>
            <TableCell>{phoneNumber.status}</TableCell>
            <TableCell>{phoneNumber.agentId || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
