'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon } from "lucide-react";
import { Prospect } from '@/types/retell';

interface PhoneNumber {
  phone_number: string;
  phone_number_pretty: string;
  nickname: string | null;
}

interface ProspectCallInitiatorProps {
  onCallInitiated: (callId: string) => void;
}

export function ProspectCallInitiator({ onCallInitiated }: ProspectCallInitiatorProps) {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [fromNumber, setFromNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prospectsResponse, phoneNumbersResponse] = await Promise.all([
          fetch('/api/prospects'),
          fetch('/api/retell/phone-numbers')
        ]);

        if (!prospectsResponse.ok || !phoneNumbersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const prospectsData = await prospectsResponse.json();
        const phoneNumbersData = await phoneNumbersResponse.json();

        setProspects(prospectsData);
        setPhoneNumbers(phoneNumbersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleInitiateCall = async () => {
    if (!fromNumber || !selectedProspect) {
      setError('Please select a from number and a prospect');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/retell/create-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_number: fromNumber,
          to_number: selectedProspect.phone,
          metadata: {
            prospect: selectedProspect,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const data = await response.json();
      onCallInitiated(data.call_id);
    } catch (error) {
      console.error('Failed to initiate call:', error);
      setError('Failed to initiate call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Prospect</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setFromNumber}>
          <SelectTrigger>
            <SelectValue placeholder="Select a from number" />
          </SelectTrigger>
          <SelectContent>
            {phoneNumbers.map((phoneNumber) => (
              <SelectItem key={phoneNumber.phone_number} value={phoneNumber.phone_number}>
                {phoneNumber.nickname || phoneNumber.phone_number_pretty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedProspect(prospects.find(p => p.id.toString() === value) || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a prospect" />
          </SelectTrigger>
          <SelectContent>
            {prospects.map((prospect) => (
              <SelectItem key={prospect.id} value={prospect.id.toString()}>
                {`${prospect.first_name} ${prospect.last_name} - ${prospect.phone}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button 
          onClick={handleInitiateCall} 
          disabled={isLoading || !fromNumber || !selectedProspect}
          className="w-full"
        >
          <PhoneIcon className="mr-2 h-4 w-4" />
          {isLoading ? 'Initiating Call...' : 'Call Prospect'}
        </Button>
      </CardContent>
    </Card>
  );
}
