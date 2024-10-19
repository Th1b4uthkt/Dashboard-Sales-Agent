'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileIcon } from "@radix-ui/react-icons";
import { initiateCall } from '@/services/retell-service';

interface Agent {
  id: string;
  name: string;
}

interface PhoneNumber {
  id: string;
  number: string;
}

interface CallInitiatorProps {
  agents: Agent[];
  phoneNumbers: PhoneNumber[];
  onCallInitiated: (callId: string) => void;
}

export function CallInitiator({ agents, phoneNumbers, onCallInitiated }: CallInitiatorProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitiateCall = async () => {
    if (!selectedAgent || !selectedPhoneNumber) {
      console.log('Call initiation failed: No agent or phone number selected');
      return;
    }

    setIsLoading(true);
    console.log('Initiating call with:', { selectedAgent, selectedPhoneNumber });

    try {
      const call = await initiateCall(selectedAgent, selectedPhoneNumber);
      onCallInitiated(call.call_id);
      console.log('Call initiated successfully:', call.call_id);
    } catch (error) {
      console.error('Error initiating call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiate Call</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={(value) => {
          console.log('Agent selected:', value);
          setSelectedAgent(value);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={`agent-${agent.id}`} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => {
          console.log('Phone number selected:', value);
          setSelectedPhoneNumber(value);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a phone number" />
          </SelectTrigger>
          <SelectContent>
            {phoneNumbers.map((phoneNumber) => (
              <SelectItem key={`phone-${phoneNumber.id}`} value={phoneNumber.id}>
                {phoneNumber.number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleInitiateCall} 
          disabled={isLoading || !selectedAgent || !selectedPhoneNumber}
          className="w-full"
        >
          <MobileIcon className="mr-2 h-4 w-4" />
          {isLoading ? 'Initiating Call...' : 'Initiate Call'}
        </Button>
      </CardContent>
    </Card>
  );
}
