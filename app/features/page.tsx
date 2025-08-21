"use client"

import { PublicHeader } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { 
  MessageCircle, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Calendar, 
  Zap, 
  Shield, 
  Globe, 
  Smartphone,
  Bot,
  FileText
} from 'lucide-react'
import Link from "next/link"

export default function FeaturesPage() {
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
                Powerful <span className="text-gradient-hero">Features</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover all the tools and capabilities that make HeavyCRM the most comprehensive communication platform for modern businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Core Communication Features
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage customer communications across multiple channels.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">WhatsApp Business</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-6">
                Send bulk messages, manage conversations, and automate responses through the official WhatsApp Business API.
              </p>
              <ul className="text-left space-y-2 text-body-small text-muted-foreground">
                <li>• Official WhatsApp Business API</li>
                <li>• Bulk messaging capabilities</li>
                <li>• Message templates</li>
                <li>• Automated responses</li>
                <li>• Read receipts & delivery status</li>
              </ul>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Email Campaigns</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-6">
                Create and send personalized email campaigns with rich templates and detailed performance tracking.
              </p>
              <ul className="text-left space-y-2 text-body-small text-muted-foreground">
                <li>• Drag & drop email builder</li>
                <li>• A/B testing capabilities</li>
                <li>• Personalization tokens</li>
                <li>• Automated sequences</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">SMS Integration</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-6">
                Reach customers instantly with SMS messaging, delivery reports, and intelligent scheduling.
              </p>
              <ul className="text-left space-y-2 text-body-small text-muted-foreground">
                <li>• Global SMS delivery</li>
                <li>• Delivery confirmations</li>
                <li>• Smart scheduling</li>
                <li>• Two-way messaging</li>
                <li>• Shortcode support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Advanced Capabilities
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Powerful tools to scale your communication strategy and automate your workflows.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="animate-slide-in-left">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Advanced Analytics</h3>
                    <p className="text-body text-muted-foreground">
                      Get detailed insights into your messaging performance with real-time analytics, engagement metrics, and ROI tracking.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Contact Management</h3>
                    <p className="text-body text-muted-foreground">
                      Organize and segment your contacts with custom fields, tags, and automated list management features.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Smart Scheduling</h3>
                    <p className="text-body text-muted-foreground">
                      Schedule messages for optimal delivery times with timezone intelligence and recipient behavior analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl"></div>
                <div className="relative card-glass p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-heading-4 text-foreground mb-2">99.9%</h4>
                      <p className="text-body text-muted-foreground">Delivery Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-heading-4 text-foreground mb-2">150+</h4>
                      <p className="text-body text-muted-foreground">Countries</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-heading-4 text-foreground mb-2">SOC 2</h4>
                      <p className="text-body text-muted-foreground">Compliant</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-heading-4 text-foreground mb-2">Mobile</h4>
                      <p className="text-body text-muted-foreground">Optimized</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Features */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Automation & Intelligence
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Leverage AI and automation to scale your communication efforts and improve customer engagement.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">AI Chatbots</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-6">
                Deploy intelligent chatbots that can handle customer inquiries 24/7 across all channels.
              </p>
              <ul className="text-left space-y-2 text-body-small text-muted-foreground">
                <li>• Natural language processing</li>
                <li>• Multi-language support</li>
                <li>• Learning algorithms</li>
                <li>• Seamless handover to humans</li>
              </ul>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Workflow Automation</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-6">
                Create automated workflows that trigger based on customer behavior and engagement.
              </p>
              <ul className="text-left space-y-2 text-body-small text-muted-foreground">
                <li>• Trigger-based automation</li>
                <li>• Multi-step sequences</li>
                <li>• Conditional logic</li>
                <li>• Integration with CRM</li>
              </ul>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Template Builder</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-6">
                Create and manage message templates with dynamic content and personalization.
              </p>
              <ul className="text-left space-y-2 text-body-small text-muted-foreground">
                <li>• Drag & drop builder</li>
                <li>• Dynamic content blocks</li>
                <li>• Template approval workflow</li>
                <li>• Version control</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Seamless Integrations
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Connect HeavyCRM with your existing tools and workflows for a unified business experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-elevated p-6 text-center group hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">CRM</span>
              </div>
              <h4 className="text-heading-4 text-foreground mb-2">CRM Systems</h4>
              <p className="text-body-small text-muted-foreground">Salesforce, HubSpot, Pipedrive</p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">EC</span>
              </div>
              <h4 className="text-heading-4 text-foreground mb-2">E-commerce</h4>
              <p className="text-body-small text-muted-foreground">Shopify, WooCommerce, Magento</p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">API</span>
              </div>
              <h4 className="text-heading-4 text-foreground mb-2">REST API</h4>
              <p className="text-body-small text-muted-foreground">Custom integrations available</p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">ZAP</span>
              </div>
              <h4 className="text-heading-4 text-foreground mb-2">Zapier</h4>
              <p className="text-body-small text-muted-foreground">1000+ app connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-primary text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Ready to Experience All Features?
            </h2>
            <p className="text-body-large text-muted-foreground mb-12 max-w-2xl mx-auto">
              Start your free trial today and discover how HeavyCRM can transform your business communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="btn-primary group min-w-[200px]">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="btn-secondary min-w-[200px]">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
