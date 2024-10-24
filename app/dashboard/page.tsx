import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return <DashboardOverview />
}
