import React from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { Activity, ArrowDown, ArrowUp, Globe, Users, Coffee, Clock, MousePointer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
//norhan
const visitorsData = [
  { name: "Jan 1", total: 1257 },
  { name: "Jan 2", total: 1896 },
  { name: "Jan 3", total: 2243 },
  { name: "Jan 4", total: 2598 },
  { name: "Jan 5", total: 2784 },
  { name: "Jan 6", total: 3477 },
  { name: "Jan 7", total: 4102 },
];

const eventsData = [
  { name: "Jan 1", total: 234 },
  { name: "Jan 2", total: 456 },
  { name: "Jan 3", total: 789 },
  { name: "Jan 4", total: 567 },
  { name: "Jan 5", total: 890 },
  { name: "Jan 6", total: 678 },
  { name: "Jan 7", total: 912 },
];

const performanceData = [
  { name: "Jan 1", load: 1.2, fcp: 0.8, lcp: 2.1 },
  { name: "Jan 2", load: 1.1, fcp: 0.9, lcp: 2.0 },
  { name: "Jan 3", load: 1.3, fcp: 0.7, lcp: 2.2 },
  { name: "Jan 4", load: 1.0, fcp: 0.8, lcp: 1.9 },
  { name: "Jan 5", load: 1.4, fcp: 1.0, lcp: 2.3 },
  { name: "Jan 6", load: 1.2, fcp: 0.9, lcp: 2.1 },
  { name: "Jan 7", load: 1.1, fcp: 0.8, lcp: 2.0 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} className="text-sm">
            <span className="font-medium" style={{ color: pld.color }}>{pld.name}: </span>
            {pld.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
        <span className={`inline-flex items-center ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {Math.abs(change)}%
        </span>{" "}
        vs last month
      </p>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = ({ activeSite }: { activeSite: any }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 space-y-6 p-8 pt-3">
        {/* Top Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Visitors"
            value="45,231"
            change={20.1}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Avg. Visit Duration"
            value="2m 13s"
            change={-1.5}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Page Views"
            value="132,544"
            change={12.3}
            icon={<MousePointer className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Bounce Rate"
            value="24.3%"
            change={4.1}
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Visitors & Events Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visitors Overview</CardTitle>
              <CardDescription>Daily unique visitors over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorsData}>
                    <XAxis 
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      name="Visitors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Custom event triggers per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventsData}>
                    <XAxis 
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="total"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      name="Events"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Load times and performance metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis 
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="load"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Page Load"
                  />
                  <Line
                    type="monotone"
                    dataKey="fcp"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={false}
                    name="First Contentful Paint"
                  />
                  <Line
                    type="monotone"
                    dataKey="lcp"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    dot={false}
                    name="Largest Contentful Paint"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;