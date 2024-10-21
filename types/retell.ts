// types/retell.ts

// Types pour les données brutes
export interface RawAgent {
  agent_id: string;
  agent_name: string;
  llm_websocket_url: string;
  voice_id: string;
  llm_id: string;
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
  provider: string;
}

export interface RawCall {
  call_type: string;
  access_token: string;
  call_id: string;
  agent_id: string;
  call_status: string;
  metadata: Record<string, any>;
  retell_llm_dynamic_variables: Record<string, any>;
  opt_out_sensitive_data_storage: boolean;
  start_timestamp: number;
  end_timestamp: number;
  transcript: string;
  transcript_object: Array<{
    role: string;
    content: string;
    words: Array<{ word: string; start: number; end: number }>;
  }>;
  transcript_with_tool_calls: Array<{
    role: string;
    content: string;
    words: Array<{ word: string; start: number; end: number }>;
  }>;
  recording_url: string;
  public_log_url: string;
  e2e_latency: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
    max: number;
    min: number;
    num: number;
  };
  llm_latency: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
    max: number;
    min: number;
    num: number;
  };
  llm_websocket_network_rtt_latency: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
    max: number;
    min: number;
    num: number;
  };
  disconnection_reason: string;
  call_analysis?: {
    call_summary?: string;
    in_voicemail?: boolean;
    user_sentiment?: 'Negative' | 'Positive' | 'Neutral' | 'Unknown';
    call_successful?: boolean;
    custom_analysis_data?: Record<string, any>;
  };
}

// Types pour les données transformées
export interface Agent {
  id: string;
  name: string;
  llm_websocket_url: string;
  voice_id: string;
  llm_id: string;
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

export interface Call {
  id: string;
  call_type: string;
  agent_id: string;
  status: string;
  start_time: string;
  end_time: string;
  duration: number;
  transcript: string;
  recording_url: string;
  call_analysis?: {
    call_summary?: string;
    in_voicemail?: boolean;
    user_sentiment?: 'Negative' | 'Positive' | 'Neutral' | 'Unknown';
    call_successful?: boolean;
    custom_analysis_data?: Record<string, any>;
  };
}

// Fonctions de transformation
export function transformAgentData(rawAgent: RawAgent): Agent {
  return {
    id: rawAgent.agent_id,
    name: rawAgent.agent_name,
    llm_websocket_url: rawAgent.llm_websocket_url,
    voice_id: rawAgent.voice_id || '',
    llm_id: rawAgent.llm_id || '',
  };
}

export function transformPhoneNumberData(rawPhoneNumber: RawPhoneNumber): PhoneNumber {
  return {
    id: rawPhoneNumber.phone_number,
    number: rawPhoneNumber.phone_number_pretty,
    status: rawPhoneNumber.phone_number_type,
    nickname: rawPhoneNumber.nickname || '',
    agentId: rawPhoneNumber.agent_id || '',
  };
}

export function transformLLMData(rawLLM: RawLLM): LLM {
  return {
    id: rawLLM.llm_id,
    name: rawLLM.model,
    provider: rawLLM.provider || '',
  };
}

export function transformCallData(rawCall: RawCall): Call {
  return {
    id: rawCall.call_id,
    call_type: rawCall.call_type,
    agent_id: rawCall.agent_id,
    status: rawCall.call_status,
    start_time: new Date(rawCall.start_timestamp).toISOString(),
    end_time: new Date(rawCall.end_timestamp).toISOString(),
    duration: (rawCall.end_timestamp - rawCall.start_timestamp) / 1000, // Convert to seconds
    transcript: rawCall.transcript,
    recording_url: rawCall.recording_url,
    call_analysis: rawCall.call_analysis,
  };
}
