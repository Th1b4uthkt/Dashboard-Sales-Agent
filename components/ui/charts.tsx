"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, Tooltip, TooltipProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartProps } from "@/types/chart-types"

// Définissons ChartTooltip et ChartTooltipContent
const ChartTooltip = Tooltip;

type ChartTooltipContentProps = TooltipProps<number, string> & {
  active?: boolean;
};

const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded shadow">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function ChartContainer({ children, className, ...props }: React.PropsWithChildren<ChartProps>) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            {React.Children.only(children) as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function LineChartComponent({ data, config, title, className }: ChartProps) {
  return (
    <ChartContainer data={data} config={config} title={title} className={className}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={`var(--color-${Object.keys(config)[0]})`} 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export function BarChartComponent({ data, config, title, className }: ChartProps) {
  return (
    <ChartContainer data={data} config={config} title={title} className={className}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {Object.keys(config).map((key) => (
          <Bar 
            key={key}
            dataKey={key} 
            fill={`var(--color-${key})`} 
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
