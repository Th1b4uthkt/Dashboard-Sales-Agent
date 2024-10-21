// app/mocks/dashboard-data.ts
export const dashboardData = {
    kpi: {
      contacts: 1234,
      activeContracts: 56,
      unreadEmails: 78,
      recentCalls: 23,
      upcomingAppointments: 12
    },
    charts: {
      monthlySales: [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 },
        { month: 'Mar', sales: 5000 },
        { month: 'Apr', sales: 4500 },
        { month: 'May', sales: 6000 },
        { month: 'Jun', sales: 5500 }
      ],
      emailPerformance: [
        { campaign: 'A', openRate: 30, clickRate: 15 },
        { campaign: 'B', openRate: 40, clickRate: 20 },
        { campaign: 'C', openRate: 35, clickRate: 18 }
      ],
      callActivity: [
        { day: 'Mon', calls: 20 },
        { day: 'Tue', calls: 25 },
        { day: 'Wed', calls: 30 },
        { day: 'Thu', calls: 28 },
        { day: 'Fri', calls: 22 }
      ]
    },
    notifications: [
      { id: 1, type: 'task', message: 'New task: Follow up with client X' },
      { id: 2, type: 'contract', message: 'Contract Y updated' },
      { id: 3, type: 'appointment', message: 'Meeting with Z scheduled for tomorrow' }
    ]
  };