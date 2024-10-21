'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon } from "lucide-react";
import { initiateCall } from '@/services/retell-service';
import { Agent, PhoneNumber, Prospect } from '@/types/retell';

interface CallInitiatorProps {
  agents: Agent[];
  phoneNumbers: PhoneNumber[];
  prospects: Prospect[];
  onCallInitiated: (callId: string) => void;
}

export function CallInitiator({ agents, phoneNumbers, prospects, onCallInitiated }: CallInitiatorProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitiateCall = async () => {
    if (!selectedAgent || !selectedPhoneNumber || !selectedProspect) {
      console.log('Call initiation failed: Missing selection');
      return;
    }

    setIsLoading(true);
    try {
      const result = await initiateCall(selectedAgent, selectedPhoneNumber, selectedProspect);
      onCallInitiated(result.call_id);
    } catch (error) {
      console.error('Failed to initiate call:', error);
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
        <Select onValueChange={setSelectedAgent}>
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

        <Select onValueChange={setSelectedPhoneNumber}>
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

        <Select onValueChange={(value) => {
          const prospect = prospects.find(p => p.id === parseInt(value));
          setSelectedProspect(prospect || null);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a prospect" />
          </SelectTrigger>
          <SelectContent>
            {prospects.map((prospect) => (
              <SelectItem key={`prospect-${prospect.id}`} value={prospect.id.toString()}>
                {`${prospect.first_name} ${prospect.last_name} - ${prospect.phone}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleInitiateCall} 
          disabled={isLoading || !selectedAgent || !selectedPhoneNumber || !selectedProspect}
          className="w-full"
        >
          <PhoneIcon className="mr-2 h-4 w-4" />
          {isLoading ? 'Initiating Call...' : 'Initiate Call'}
        </Button>
      </CardContent>
    </Card>
  );
}
