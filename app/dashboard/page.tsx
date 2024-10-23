import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return <div>Dashboard content for {user.email}</div>
}
