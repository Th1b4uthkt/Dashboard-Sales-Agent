'use client'

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import {
  AlignJustify,
  Bot,
  BrainCircuit,
  Home,
  MessageSquare,
  PanelLeft,
  Phone,
  Settings,
  Zap,
  Database,
  UserCheck,
  Search,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/hooks/use-toast"
import { AuthModal } from '@/components/auth/AuthModal'
import { logout } from '@/app/actions/auth'

interface DashboardProps {
  children: React.ReactNode
}

interface User {
  email: string;
  user_metadata: {
    avatar_url?: string;
  };
}

export function Dashboard({ children }: DashboardProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            email: session.user.email || '',
            user_metadata: session.user.user_metadata
          });
          toast({ title: "Signed in successfully" });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          toast({ title: "Signed out successfully" });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, toast]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.error) {
      toast({ title: "Error signing out", description: result.error, variant: "destructive" });
    }
  };

  const menuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/prospects", icon: UserCheck, label: "Prospects" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
    { href: "/dashboard/phone", icon: Phone, label: "Phone" },
    { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
    { href: "/dashboard/tasks", icon: AlignJustify, label: "Tasks" },
    { href: "/dashboard/storage", icon: Database, label: "Storage" },
    { href: "/dashboard/tools", icon: Zap, label: "Tools" },
    { href: "/dashboard/agent-ai", icon: Bot, label: "Agent AI" },
    { href: "https://www.ai-consultant.fr/", icon: BrainCircuit, label: "AI-consultant" },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-10 w-64 flex-col border-r border-border bg-card hidden sm:flex">
          <nav className="flex flex-col items-start gap-4 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold text-primary"
            >
              <BrainCircuit className="h-6 w-6" />
              <span>AI Agent Dashboard</span>
            </Link>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 sm:ml-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card px-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background text-foreground sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg border-input bg-background pl-8 text-foreground placeholder-muted-foreground md:w-[200px] lg:w-[300px]"
              />
            </div>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  {user ? (
                    <Image
                      src={user.user_metadata.avatar_url || "/placeholder-user.jpg"}
                      width={36}
                      height={36}
                      alt="Avatar"
                      className="overflow-hidden rounded-full"
                    />
                  ) : (
                    <UserCheck className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card text-card-foreground">
                {user ? (
                  <>
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onSelect={() => setIsAuthModalOpen(true)}>Login</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="grid flex-1 gap-4 p-4 md:gap-8 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
