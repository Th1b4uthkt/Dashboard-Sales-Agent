'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import {
  AlignJustify,
  Bot,
  BrainCircuit,
  FileText,
  Home,
  MessageSquare,
  PanelLeft,
  Phone,
  Settings,
  Zap,
  Database,
  UserCheck,
  Search,
  ListFilter,
  PlusCircle,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardProps {
  children: React.ReactNode
}

export function Dashboard({ children }: DashboardProps) {
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
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-10 w-64 flex-col border-r border-white/10 bg-black/50 backdrop-blur-md hidden sm:flex">
          <nav className="flex flex-col items-start gap-4 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold text-white"
            >
              <BrainCircuit className="h-6 w-6" />
              <span>AI Agent Dashboard</span>
            </Link>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-white hover:text-white/80"
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
              className="flex items-center gap-2 text-white hover:text-white/80"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 sm:ml-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-black/50 px-4 backdrop-blur-md">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-black/90 text-white sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg border-white/10 bg-white/5 pl-8 text-white placeholder-white/50 md:w-[200px] lg:w-[300px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="overflow-hidden rounded-full border border-white/10 bg-white/5"
                >
                  <Image
                    src="/placeholder-user.jpg"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black/90 text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Settings</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Support</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="grid flex-1 gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1 border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 text-white">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuCheckboxItem checked className="focus:bg-white/10 focus:text-white">
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="focus:bg-white/10 focus:text-white">Inactive</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="focus:bg-white/10 focus:text-white">
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1 border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button size="sm" className="h-8 gap-1 bg-white text-black hover:bg-white/90">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Prospect
                  </span>
                </Button>
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
