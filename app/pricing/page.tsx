"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"
import { Check, Star, Zap, Shield } from 'lucide-react'
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-hero">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-radial"></div>
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-bounce-gentle"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container-primary relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in hero-content-bg">
              <h1 className="text-display text-white hero-text-shadow mb-8">
                Simple, Transparent <br />
                <span className="text-gradient-hero">Pricing</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-12 max-w-2xl mx-auto leading-relaxed">
                Choose the plan that best suits your business needs. No hidden fees, cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Monthly Plans */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-heading-3 text-foreground mb-4">Monthly Plans</h3>
                <p className="text-body text-muted-foreground">Perfect for getting started</p>
              </div>
              
              {/* Outside India Monthly */}
              <div className="card-elevated p-8 group hover-lift animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-foreground">Global Plan</h4>
                    <p className="text-body-small text-muted-foreground">Outside India</p>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">$20</span>
                    <span className="text-body text-muted-foreground">/month</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">WhatsApp Business API</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Email Campaigns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">SMS Integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Advanced Analytics</span>
                  </div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="btn-primary w-full group">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* India Monthly */}
              <div className="card-elevated p-8 group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-foreground">India Plan</h4>
                    <p className="text-body-small text-muted-foreground">For Indian businesses</p>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">₹1,499</span>
                    <span className="text-body text-muted-foreground">/month</span>
                  </div>
                  <p className="text-body-small text-muted-foreground mt-2">+18% GST</p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">WhatsApp Business API</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Email Campaigns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">SMS Integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Priority Support</span>
                  </div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="btn-primary w-full group">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Yearly Plans */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-heading-3 text-foreground mb-4">Yearly Plans</h3>
                <p className="text-body text-muted-foreground">Save more with annual billing</p>
              </div>
              
              {/* Outside India Yearly */}
              <div className="card-elevated p-8 group hover-lift animate-slide-up relative" style={{animationDelay: '0.2s'}}>
                <div className="absolute -top-3 right-6">
                  <div className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    2 Months Free
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-foreground">Global Annual</h4>
                    <p className="text-body-small text-muted-foreground">Outside India</p>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">$200</span>
                    <span className="text-body text-muted-foreground">/year</span>
                  </div>
                  <p className="text-body-small text-green-600 mt-2">Save $40 per year</p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Everything in Monthly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Priority Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Advanced Integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Custom Branding</span>
                  </div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="btn-primary w-full group">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* India Yearly */}
              <div className="card-elevated p-8 group hover-lift animate-slide-up relative" style={{animationDelay: '0.3s'}}>
                <div className="absolute -top-3 right-6">
                  <div className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    2 Months Free
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-heading-4 text-foreground">India Annual</h4>
                    <p className="text-body-small text-muted-foreground">For Indian businesses</p>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">₹15,000</span>
                    <span className="text-body text-muted-foreground">/year</span>
                  </div>
                  <p className="text-body-small text-muted-foreground mt-1">+18% GST</p>
                  <p className="text-body-small text-green-600 mt-1">Save ₹2,988 per year</p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Everything in Monthly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Dedicated Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">Custom Integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-body text-foreground">White-label Solutions</span>
                  </div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="btn-primary w-full group">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="text-center mb-16">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
              Have questions about our pricing? We've got answers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">Can I change plans anytime?</h3>
              <p className="text-body text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">Is there a free trial?</h3>
              <p className="text-body text-muted-foreground">
                We offer a 14-day free trial with full access to all features. No credit card required.
              </p>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">What payment methods do you accept?</h3>
              <p className="text-body text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">Do you offer refunds?</h3>
              <p className="text-body text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for all plans. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-primary text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-body-large text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of businesses who trust our platform to manage their customer communications effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="btn-primary group min-w-[200px]">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="btn-secondary min-w-[200px]">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

