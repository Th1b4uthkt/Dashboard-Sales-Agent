// components/dashboard/dashboard-overview.tsx

'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserCheck, Mail, Phone, Calendar, FileText, Plus, Send, Bell } from "lucide-react";
import { dashboardData } from "@/app/mocks/dashboard-data";
import { LineChartComponent, BarChartComponent } from '@/components/ui/charts';
import { ChartData, ChartConfig, ChartProps } from "@/types/chart-types";

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, isLoading }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

interface ChartCardProps {
  title: string;
  chart: React.ComponentType<ChartProps>;
  data: ChartData[];
  isLoading: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, chart: Chart, data, isLoading }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Chart data={data} config={chartConfig} title={title} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hover over chart points for more details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </CardContent>
  </Card>
);

// Définir la configuration des graphiques
const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

export function DashboardOverview() {
  const { kpi, charts, notifications } = dashboardData;
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const paginatedNotifications = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return notifications.slice(start, end);
  }, [notifications, page]);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Dashboard Overview</h2>
      
      {/* KPI Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Contacts" value={kpi.contacts} icon={<UserCheck className="h-4 w-4" />} isLoading={isLoading} />
        <KPICard title="Active Contracts" value={kpi.activeContracts} icon={<FileText className="h-4 w-4" />} isLoading={isLoading} />
        <KPICard title="Unread Emails" value={kpi.unreadEmails} icon={<Mail className="h-4 w-4" />} isLoading={isLoading} />
        <KPICard title="Recent Calls" value={kpi.recentCalls} icon={<Phone className="h-4 w-4" />} isLoading={isLoading} />
        <KPICard title="Upcoming Appointments" value={kpi.upcomingAppointments} icon={<Calendar className="h-4 w-4" />} isLoading={isLoading} />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard 
          title="Monthly Sales"
          chart={LineChartComponent}
          data={charts.monthlySales.map(item => ({ name: item.month, value: item.sales, month: item.month }))}
          isLoading={isLoading}
        />
        <ChartCard 
          title="Email Performance"
          chart={BarChartComponent}
          data={charts.emailPerformance.map(item => ({ name: item.campaign, value: item.openRate, campaign: item.campaign }))}
          isLoading={isLoading}
        />
        <ChartCard 
          title="Call Activity"
          chart={BarChartComponent}
          data={charts.callActivity.map(item => ({ name: item.day, value: item.calls, day: item.day }))}
          isLoading={isLoading}
        />
      </div>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {paginatedNotifications.map((notification) => (
                <li key={notification.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md transition-colors">
                  <Bell className="h-4 w-4" /> {/* Utilisez l'icône Bell à la place de NotificationIcon */}
                  <span>{notification.message}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button onClick={() => setPage(p => p + 1)} disabled={page * itemsPerPage >= notifications.length}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <div className="flex flex-wrap gap-4">
        <Button><Plus className="mr-2 h-4 w-4" /> Add Contact</Button>
        <Button><FileText className="mr-2 h-4 w-4" /> New Contract</Button>
        <Button><Send className="mr-2 h-4 w-4" /> Send Email</Button>
        <Button><Phone className="mr-2 h-4 w-4" /> Schedule Call</Button>
      </div>
    </div>
  );
}
