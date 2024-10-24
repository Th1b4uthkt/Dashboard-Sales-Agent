'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon } from "lucide-react";

interface RetellCallInitiatorProps {
  onCallInitiated: (callId: string) => void;
}

export function RetellCallInitiator({ onCallInitiated }: RetellCallInitiatorProps) {
  const [fromNumber, setFromNumber] = useState<string>('');
  const [toNumber, setToNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        const errorData = await response.json();
        throw new Error(`Failed to initiate call: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Call initiated successfully:', data);
      onCallInitiated(data.call_id);
    } catch (error: unknown) {
      console.error('Error initiating call:', error instanceof Error ? error.message : String(error));
      setError('Failed to initiate call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Initiate Simple Call</CardTitle>
        <p className="text-sm text-muted-foreground">Start a call with a single number</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={(value) => setFromNumber(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a from number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="+18137012050" value="+18137012050">+1 813-701-2050</SelectItem>
            {/* Add more numbers as needed */}
          </SelectContent>
        </Select>
        <Input
          placeholder="To Number (e.g., +12137774445)"
          value={toNumber}
          onChange={(e) => setToNumber(e.target.value)}
          className="w-full"
        />
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <Button 
          onClick={handleInitiateCall} 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Initiating Call...
            </>
          ) : (
            <>
              <PhoneIcon className="mr-2 h-4 w-4" />
              Initiate Call
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
