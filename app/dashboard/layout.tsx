import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Dashboard } from "@/components/dashboard/ai-agent-dashboard"
import '../polyfills';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return <Dashboard>{children}</Dashboard>
}
