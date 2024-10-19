'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PhoneNumber {
  id: string;
  number: string;
  status: string;
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
          <TableHead>ID</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {phoneNumbers.map((phoneNumber) => (
          <TableRow key={phoneNumber.id}>
            <TableCell>{phoneNumber.id}</TableCell>
            <TableCell>{phoneNumber.number}</TableCell>
            <TableCell>{phoneNumber.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
