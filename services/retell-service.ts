import { Prospect } from '@/types/retell';

export async function getPhoneNumbers() {
  const response = await fetch('/api/retell?action=getPhoneNumbers');
  if (!response.ok) {
    throw new Error('Failed to fetch phone numbers');
  }
  const data = await response.json();
  return data.phoneNumbers;
}

export async function initiateCall(agentId: string, fromNumber: string, prospect: Prospect) {
  const fullProspectNumber = `${prospect.country_code}${prospect.phone}`;
  const response = await fetch('/api/retell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      action: 'initiateCall', 
      agentId, 
      fromNumber, 
      toNumber: fullProspectNumber 
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initiate call');
  }

  return response.json();
}
