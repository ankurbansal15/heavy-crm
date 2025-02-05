"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesPipeline } from "@/components/sales/SalesPipeline"
import { SalesForecast } from "@/components/sales/SalesForecast"

// Mock data for sales analytics
const salesData = {
  opportunities: [
    { id: '1', name: 'Enterprise Software Deal', value: 100000, stage: 'Lead', probability: 60, priority: 'High', pipeline: 'default' },
    { id: '2', name: 'SMB Consulting Project', value: 50000, stage: 'Contacted', probability: 80, priority: 'Medium', pipeline: 'default' },
    { id: '3', name: 'Startup SaaS Package', value: 25000, stage: 'Closed', probability: 100, priority: 'Low', pipeline: 'default' },
    { id: '4', name: 'Healthcare Tech Solution', value: 75000, stage: 'Lead', probability: 40, priority: 'High', pipeline: 'default' },
    { id: '5', name: 'Retail Analytics Platform', value: 60000, stage: 'Contacted', probability: 70, priority: 'Medium', pipeline: 'default' },
  ],
  pipeline: {
    id: 'default',
    name: 'Default Pipeline',
    stages: ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Closed'],
  }
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("messaging")

  return (
    <div className="container mx-auto p-8 bg-white dark:bg-background">
      <h1 className="text-3xl font-bold mb-6">Analytics and Reports</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="messaging">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-white dark:bg-background">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Total Messages Sent
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">1,234,567</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Delivery Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">98.7%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Read Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">76.2%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Response Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">12.5%</div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6 bg-white dark:bg-background">
            <CardHeader className="bg-white dark:bg-background">
              <CardTitle>Message Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 bg-white dark:bg-background">
              <Overview />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-white dark:bg-background">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Total Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">{salesData.opportunities.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">
                  ${salesData.opportunities.reduce((sum, opp) => sum + opp.value, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Average Deal Size
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">
                  ${(salesData.opportunities.reduce((sum, opp) => sum + opp.value, 0) / salesData.opportunities.length).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white dark:bg-background">
                <CardTitle className="text-sm font-medium">
                  Win Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white dark:bg-background">
                <div className="text-2xl font-bold">
                  {((salesData.opportunities.filter(opp => opp.stage === 'Closed').length / salesData.opportunities.length) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6 bg-white dark:bg-background">
            <CardHeader className="bg-white dark:bg-background">
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 bg-white dark:bg-background">
              <SalesPipeline
                opportunities={salesData.opportunities}
                currentPipeline={salesData.pipeline}
              />
            </CardContent>
          </Card>
          <Card className="mt-6 bg-white dark:bg-background">
            <CardHeader className="bg-white dark:bg-background">
              <CardTitle>Sales Forecast</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 bg-white dark:bg-background">
              <SalesForecast
                opportunities={salesData.opportunities}
                currentPipeline={salesData.pipeline}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

