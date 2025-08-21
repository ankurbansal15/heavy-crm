"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, MessageSquare, Mail, Smartphone, DollarSign, Users, Target, Calendar, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("messaging")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-heading-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                Analytics & Reports
              </h1>
              <p className="text-body text-muted-foreground">
                Comprehensive insights into your messaging and sales performance
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <BarChart3 className="w-4 h-4" />
                REAL-TIME ANALYTICS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass-effect border-0 shadow-lg hover-lift">
            <TabsTrigger value="messaging" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messaging Analytics
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              <DollarSign className="w-4 h-4 mr-2" />
              Sales Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messaging" className="space-y-8 animate-fade-in">
            {/* Messaging Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
              <Card className="card-elevated hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Total Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">1,234,567</div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-900 dark:text-green-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Delivery Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">98.7%</div>
                  <p className="text-green-700 dark:text-green-300 text-sm">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Open Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">76.2%</div>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">+5.8% from last month</p>
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-900 dark:text-orange-100 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Response Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-2">12.5%</div>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">+1.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Overview Chart */}
            <Card className="card-elevated hover-lift glass-effect border-0 shadow-xl animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-heading-4">Message Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Overview />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-8 animate-fade-in">
            {/* Sales Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
              <Card className="card-elevated hover-lift bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-900 dark:text-green-100 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">$2.4M</div>
                  <p className="text-green-700 dark:text-green-300 text-sm">+18.2% from last month</p>
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">24.8%</div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">+3.1% from last month</p>
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Active Deals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">127</div>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">+12 new this month</p>
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-900 dark:text-orange-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Avg. Deal Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-2">45 days</div>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">-3 days from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Charts */}
            <div className="grid gap-8 md:grid-cols-2 animate-slide-in-left">
              <Card className="card-elevated hover-lift glass-effect border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-heading-4">Pipeline Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Sales pipeline visualization will be shown here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated hover-lift glass-effect border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-heading-4">Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Revenue forecasting will be shown here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}