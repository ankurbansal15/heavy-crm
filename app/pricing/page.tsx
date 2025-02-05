import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen">
      <PublicHeader />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that best suits your needs. No hidden fees, cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pricing Card for Outside India (Monthly) */}
            <Card className="transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Monthly Plan (Outside India)</CardTitle>
              </CardHeader>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary mb-4">$20</p>
                  <p className="text-lg text-muted-foreground">per month</p>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pricing Card for India (Monthly) */}
            <Card className="transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Monthly Plan (India)</CardTitle>
              </CardHeader>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary mb-4">₹1499</p>
                  <p className="text-lg text-muted-foreground">+18% GST</p>
                  <p className="text-lg text-muted-foreground">per month</p>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pricing Card for Outside India (Yearly) */}
            <Card className="transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Yearly Plan (Outside India)</CardTitle>
              </CardHeader>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary mb-4">$200</p>
                  <p className="text-lg text-muted-foreground">per year</p>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pricing Card for India (Yearly) */}
            <Card className="transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Yearly Plan (India)</CardTitle>
              </CardHeader>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary mb-4">₹15000</p>
                  <p className="text-lg text-muted-foreground">+18% GST</p>
                  <p className="text-lg text-muted-foreground">per year</p>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

