import { Dashboard } from "@/components/dashboard/ai-agent-dashboard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Dashboard>{children}</Dashboard>
}
