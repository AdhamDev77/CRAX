import React from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Activity, ArrowDown, ArrowUp, Globe, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

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

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        <span className={`inline-flex items-center ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {Math.abs(change)}%
        </span>{" "}
        vs last month
      </p>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = ({activeSite}:{activeSite: any}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {activeSite.metaIcon ? (
                          <img
                            className="w-4"
                            alt={`${activeSite.name} project`}
                            src={activeSite.metaIcon}
                          />
                        ) : (
                            <Globe className="h-4 w-4" />
                        )}
            
            {`${activeSite.path}.craxsite.com`}
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
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
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="Page Views"
                value="132,544"
                change={12.3}
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="Bounce Rate"
                value="24.3%"
                change={4.1}
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Visitors Overview</CardTitle>
                  <CardDescription>Daily unique visitors over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={visitorsData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>Custom event triggers per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventsData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="total"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events Analytics</CardTitle>
                <CardDescription>Detailed event tracking and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Website performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;