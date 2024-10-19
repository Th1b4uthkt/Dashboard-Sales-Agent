export async function getPhoneNumbers() {
  const response = await fetch('/api/retell?action=getPhoneNumbers');
  if (!response.ok) {
    throw new Error('Failed to fetch phone numbers');
  }
  const data = await response.json();
  return data.phoneNumbers;
}

export async function initiateCall(agentId: string, phoneNumberId: string) {
  const response = await fetch('/api/retell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'initiateCall', agentId, phoneNumberId }),
  });

  if (!response.ok) {
    throw new Error('Failed to initiate call');
  }

  return response.json();
}
