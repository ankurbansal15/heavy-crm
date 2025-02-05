import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const integrations = [
  {
    name: "Shopify",
    description: "Connect your Shopify store to send order updates and promotional messages.",
    connected: true,
  },
  {
    name: "Salesforce",
    description: "Integrate with Salesforce CRM to sync contacts and automate messaging workflows.",
    connected: false,
  },
  {
    name: "Zapier",
    description: "Connect WhatsApp messaging with thousands of apps through Zapier.",
    connected: true,
  },
  {
    name: "HubSpot",
    description: "Sync contacts and automate messaging with your HubSpot CRM.",
    connected: false,
  },
]

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API and Integrations</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader>
              <CardTitle>{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant={integration.connected ? "secondary" : "default"}>
                {integration.connected ? "Manage" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Access our API documentation to integrate WhatsApp messaging into your own applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">View API Docs</Button>
        </CardContent>
      </Card>
    </div>
  )
}

