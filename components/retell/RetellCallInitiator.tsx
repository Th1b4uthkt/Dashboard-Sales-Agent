'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon } from "lucide-react";

interface PhoneNumber {
  phone_number: string;
  phone_number_pretty: string;
  nickname: string | null;
}

interface RetellCallInitiatorProps {
  onCallInitiated: (callId: string) => void;
}

export function RetellCallInitiator({ onCallInitiated }: RetellCallInitiatorProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [fromNumber, setFromNumber] = useState('');
  const [toNumber, setToNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch('/api/retell/phone-numbers');
        if (!response.ok) {
          throw new Error('Failed to fetch phone numbers');
        }
        const data = await response.json();
        setPhoneNumbers(data);
      } catch (error) {
        console.error('Error fetching phone numbers:', error);
        setError('Failed to load phone numbers. Please try again later.');
      }
    };

    fetchPhoneNumbers();
  }, []);

  const handleInitiateCall = async () => {
    if (!fromNumber || !toNumber) {
      setError('Please select a from number and enter a to number');
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
          to_number: toNumber,
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
        <CardTitle>Initiate Simple Call</CardTitle>
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
        <Input
          placeholder="To Number (e.g., +12137774445)"
          value={toNumber}
          onChange={(e) => setToNumber(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button 
          onClick={handleInitiateCall} 
          disabled={isLoading || !fromNumber || !toNumber}
          className="w-full"
        >
          <PhoneIcon className="mr-2 h-4 w-4" />
          {isLoading ? 'Initiating Call...' : 'Initiate Call'}
        </Button>
      </CardContent>
    </Card>
  );
}
