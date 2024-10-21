// types/retell.ts

// Types pour les données brutes
export interface RawAgent {
  agent_id: string;
  agent_name: string;
  llm_websocket_url: string;
}

export interface RawPhoneNumber {
  phone_number: string;
  phone_number_pretty: string;
  phone_number_type: string;
  nickname: string;
  agent_id: string;
}

export interface RawLLM {
  llm_id: string;
  model: string;
}

// Types pour les données transformées
export interface Agent {
  id: string;
  name: string;
  llm_websocket_url: string;
  voice_id: string;
  llm_id: string; // Ajout de cette propriété
}

export interface PhoneNumber {
  id: string;
  number: string;
  status: string;
  nickname: string;
  agentId: string;
}

export interface LLM {
  id: string;
  name: string;
  provider: string;
}

export interface Prospect {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string;
}
