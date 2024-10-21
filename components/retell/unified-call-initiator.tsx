import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneIcon, Hash } from "lucide-react";
import { initiateCall } from '@/services/retell-service';
import { Agent, PhoneNumber, Prospect } from '@/types/retell';

interface UnifiedCallInitiatorProps {
  agents: Agent[];
  phoneNumbers: PhoneNumber[];
  prospects: Prospect[];
  onCallInitiated: (callId: string) => void;
}

export function UnifiedCallInitiator({ agents, phoneNumbers, prospects, onCallInitiated }: UnifiedCallInitiatorProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [manualPhoneNumber, setManualPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isLoading, setIsLoading] = useState(false);

  const handleInitiateCall = async (isManual: boolean) => {
    if (!selectedAgent) {
      console.log('Call initiation failed: No agent selected');
      return;
    }

    let toNumber: string;
    let prospectData: Prospect;

    if (isManual) {
      if (!manualPhoneNumber) {
        console.log('Call initiation failed: No manual phone number entered');
        return;
      }
      toNumber = `${countryCode}${manualPhoneNumber}`;
      prospectData = {
        id: Date.now(),
        first_name: 'Manual',
        last_name: 'Call',
        email: 'manual@example.com',
        phone: toNumber,
        country_code: countryCode
      };
    } else {
      if (!selectedPhoneNumber || !selectedProspect) {
        console.log('Call initiation failed: Missing selection');
        return;
      }
      toNumber = `${selectedProspect.country_code}${selectedProspect.phone}`;
      prospectData = selectedProspect;
    }

    setIsLoading(true);
    try {
      const result = await initiateCall(selectedAgent, selectedPhoneNumber || '', prospectData);
      onCallInitiated(result.call_id);
    } catch (error) {
      console.error('Failed to initiate call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Initiate Call</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prospect">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prospect">Prospect Call</TabsTrigger>
            <TabsTrigger value="manual">Manual Call</TabsTrigger>
          </TabsList>
          <TabsContent value="prospect" className="space-y-4">
            <Select onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
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
                  <SelectItem key={phoneNumber.id} value={phoneNumber.id}>
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
                  <SelectItem key={prospect.id} value={prospect.id.toString()}>
                    {`${prospect.first_name} ${prospect.last_name} - ${prospect.phone}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => handleInitiateCall(false)} 
              disabled={isLoading || !selectedAgent || !selectedPhoneNumber || !selectedProspect}
              className="w-full"
            >
              <PhoneIcon className="mr-2 h-4 w-4" />
              {isLoading ? 'Initiating Call...' : 'Initiate Prospect Call'}
            </Button>
          </TabsContent>
          <TabsContent value="manual" className="space-y-4">
            <Select onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Input
                placeholder="Country Code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/3"
              />
              <Input
                placeholder="Phone Number"
                value={manualPhoneNumber}
                onChange={(e) => setManualPhoneNumber(e.target.value)}
                className="w-2/3"
              />
            </div>
            <Button 
              onClick={() => handleInitiateCall(true)} 
              disabled={isLoading || !selectedAgent || !manualPhoneNumber}
              className="w-full"
            >
              <Hash className="mr-2 h-4 w-4" />
              {isLoading ? 'Initiating Call...' : 'Initiate Manual Call'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
