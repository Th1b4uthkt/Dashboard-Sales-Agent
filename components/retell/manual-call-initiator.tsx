'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon, Hash } from "lucide-react";
import { initiateCall } from '@/services/retell-service';
import { Agent, Prospect } from '@/types/retell';

interface ManualCallInitiatorProps {
  agents: Agent[];
  onCallInitiated: (callId: string) => void;
}

export function ManualCallInitiator({ agents, onCallInitiated }: ManualCallInitiatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitiateCall = async () => {
    if (!selectedAgent || !phoneNumber) {
      console.log('Call initiation failed: Missing selection');
      return;
    }

    setIsLoading(true);
    try {
      const fullNumber = `${countryCode}${phoneNumber}`;
      const prospectData: Prospect = {
        id: Date.now(), // Génère un ID unique de type number
        first_name: 'Manual',
        last_name: 'Call',
        email: 'manual@example.com',
        phone: fullNumber,
        country_code: countryCode
      };
      const result = await initiateCall(selectedAgent, fullNumber, prospectData);
      onCallInitiated(result.call_id);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to initiate call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Hash className="mr-2 h-4 w-4" />
          Manual Call
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Initiate Manual Call</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Enter Phone Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Country Code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/3"
              />
              <Input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-2/3"
              />
            </div>
            <select
              value={selectedAgent || ''}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <Button 
              onClick={handleInitiateCall} 
              disabled={isLoading || !selectedAgent || !phoneNumber}
              className="w-full"
            >
              <PhoneIcon className="mr-2 h-4 w-4" />
              {isLoading ? 'Initiating Call...' : 'Initiate Call'}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
