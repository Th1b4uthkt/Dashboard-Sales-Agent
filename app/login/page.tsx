'use client'

import { AuthModal } from '@/components/auth/AuthModal'
import { useState } from 'react'

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true)
  return <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
