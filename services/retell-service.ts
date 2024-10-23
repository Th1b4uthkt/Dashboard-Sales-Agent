import { Prospect } from '@/types/retell';

export async function getPhoneNumbers() {
  const response = await fetch('/api/retell/phone-numbers');
  if (!response.ok) {
    throw new Error('Failed to fetch phone numbers');
  }
  return await response.json();
}

export async function initiateCall(fromNumber: string, toNumber: string, prospectData: Prospect) {
  const response = await fetch('/api/retell/create-call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from_number: fromNumber,
      to_number: toNumber,
      metadata: {
        prospect: prospectData,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initiate call');
  }

  return await response.json();
}
