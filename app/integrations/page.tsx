import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Link, Shield, Plug2, ExternalLink, CheckCircle, Clock } from 'lucide-react'

const integrations = [
  {
    name: "Shopify",
    description: "Connect your Shopify store to send order updates and promotional messages.",
    connected: true,
    category: "E-commerce",
    color: "green"
  },
  {
    name: "Salesforce",
    description: "Integrate with Salesforce CRM to sync contacts and automate messaging workflows.",
    connected: false,
    category: "CRM",
    color: "blue"
  },
  {
    name: "Zapier",
    description: "Connect WhatsApp messaging with thousands of apps through Zapier.",
    connected: true,
    category: "Automation",
    color: "orange"
  },
  {
    name: "HubSpot",
    description: "Sync contacts and automate messaging with your HubSpot CRM.",
    connected: false,
    category: "CRM",
    color: "purple"
  },
  {
    name: "WooCommerce",
    description: "Integrate with WooCommerce to automate order confirmations and shipping updates.",
    connected: false,
    category: "E-commerce",
    color: "indigo"
  },
  {
    name: "Stripe",
    description: "Send payment confirmations and receipt notifications via WhatsApp.",
    connected: true,
    category: "Payments",
    color: "violet"
  },
]

export default function IntegrationsPage() {
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
                API & Integrations
              </h1>
              <p className="text-body text-muted-foreground">
                Connect Heavy CRM with your favorite tools and automate your workflows
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <Plug2 className="w-4 h-4" />
                50+ INTEGRATIONS AVAILABLE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 animate-slide-up">
          <Card className="card-elevated hover-lift bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-900 dark:text-green-100 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Connected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
                {integrations.filter(i => i.connected).length}
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm">Active integrations</p>
            </CardContent>
          </Card>

          <Card className="card-elevated hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                {integrations.filter(i => !i.connected).length}
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm">Ready to connect</p>
            </CardContent>
          </Card>

          <Card className="card-elevated hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                {[...new Set(integrations.map(i => i.category))].length}
              </div>
              <p className="text-purple-700 dark:text-purple-300 text-sm">Integration types</p>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="space-y-6 animate-slide-in-left">
          <h2 className="text-heading-4 font-semibold">Available Integrations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration, index) => (
              <Card key={integration.name} className="card-elevated hover-lift glass-effect border-0 shadow-lg animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 bg-${integration.color}-100 dark:bg-${integration.color}-900 rounded-full flex items-center justify-center`}>
                      <Link className={`w-6 h-6 text-${integration.color}-600 dark:text-${integration.color}-400`} />
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {integration.name}
                      <span className={`px-2 py-1 text-xs rounded-full bg-${integration.color}-100 dark:bg-${integration.color}-900 text-${integration.color}-700 dark:text-${integration.color}-300`}>
                        {integration.category}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {integration.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant={integration.connected ? "secondary" : "default"} 
                    className="w-full"
                  >
                    {integration.connected ? "Manage" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* API Documentation Section */}
        <Card className="card-elevated hover-lift glass-effect border-0 shadow-xl animate-slide-in-right">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-heading-4">API Documentation</CardTitle>
                <CardDescription>
                  Powerful REST API to integrate Heavy CRM into your own applications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">API Uptime</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary mb-2">&lt;100ms</div>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary mb-2">Enterprise</div>
                <p className="text-sm text-muted-foreground">Security</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="default" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View API Docs
              </Button>
              <Button variant="outline">
                Get API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

