const API_KEY = process.env.CALCOM_API_KEY
const BASE_URL = 'https://api.cal.com/v2'

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return await response.json()
}

export async function getEvents() {
  return fetchWithAuth('/bookings')
}

export const createEvent = async (eventData: Event) => {
  // Implémentation de la création d'événement
};

export const updateEvent = async (
  eventId: string,
  eventData: any
) => {
  return fetchWithAuth(`/bookings/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(eventData),
  })
};

export async function deleteEvent(eventId: string) {
  return fetchWithAuth(`/bookings/${eventId}`, {
    method: 'DELETE',
  })
}
