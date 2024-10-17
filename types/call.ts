export interface Call {
  id: string
  type: 'incoming' | 'outgoing'
  number: string
  date: string
  duration: string
  transcription: string
  status: 'active' | 'on-hold' | 'ended'
}
