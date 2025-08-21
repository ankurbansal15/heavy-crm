"use client"

import { PublicHeader } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { Users, Target, Award, Globe, Zap, Shield } from 'lucide-react'
import Link from "next/link"

export default function AboutPage() {
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
                About <span className="text-gradient-hero">HeavyCRM</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-12 max-w-3xl mx-auto leading-relaxed">
                We're revolutionizing business communication by providing the most comprehensive platform for WhatsApp, Email, and SMS messaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="animate-slide-in-left">
              <h2 className="text-heading-1 mb-8 text-foreground">
                Our Mission
              </h2>
              <p className="text-body-large text-muted-foreground mb-8 leading-relaxed">
                To empower businesses of all sizes with seamless communication tools that drive growth, 
                enhance customer relationships, and streamline operations through innovative technology.
              </p>
              <p className="text-body text-muted-foreground mb-8 leading-relaxed">
                We believe that effective communication is the cornerstone of successful businesses. 
                That's why we've built a platform that combines the power of WhatsApp Business API, 
                email marketing, and SMS messaging into one unified solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="btn-primary">Get Started</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="btn-secondary">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl"></div>
                <div className="relative card-glass p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-heading-4 text-foreground mb-2">10K+</h3>
                      <p className="text-body text-muted-foreground">Happy Customers</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-heading-4 text-foreground mb-2">150+</h3>
                      <p className="text-body text-muted-foreground">Countries</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-heading-4 text-foreground mb-2">1M+</h3>
                      <p className="text-body text-muted-foreground">Messages Sent</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-heading-4 text-foreground mb-2">99.9%</h3>
                      <p className="text-body text-muted-foreground">Uptime SLA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Our Core Values
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              These values guide everything we do and shape how we build products and serve our customers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Customer First</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Every decision we make is guided by what's best for our customers. Their success is our success.
              </p>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Innovation</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                We continuously push the boundaries of what's possible with communication technology.
              </p>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Security</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                We prioritize the security and privacy of our customers' data with enterprise-grade protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Leadership Team
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Meet the experienced leaders driving HeavyCRM's vision and growth.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card-elevated p-6 text-center group hover-lift animate-slide-up">
              <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JS</span>
              </div>
              <h3 className="text-heading-4 text-foreground mb-2">John Smith</h3>
              <p className="text-body text-primary mb-3">CEO & Founder</p>
              <p className="text-body-small text-muted-foreground">
                15+ years in enterprise software and communication platforms
              </p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">SK</span>
              </div>
              <h3 className="text-heading-4 text-foreground mb-2">Sarah Kim</h3>
              <p className="text-body text-primary mb-3">CTO</p>
              <p className="text-body-small text-muted-foreground">
                Expert in scalable messaging infrastructure and API design
              </p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">MP</span>
              </div>
              <h3 className="text-heading-4 text-foreground mb-2">Michael Park</h3>
              <p className="text-body text-primary mb-3">VP of Product</p>
              <p className="text-body-small text-muted-foreground">
                Product strategist with deep expertise in customer communication
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Our Journey
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              From a simple idea to a comprehensive communication platform serving thousands of businesses worldwide.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary"></div>
              <div className="space-y-12">
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-white font-bold">2022</span>
                  </div>
                  <div className="card-elevated p-6 flex-1">
                    <h3 className="text-heading-4 text-foreground mb-2">Company Founded</h3>
                    <p className="text-body text-muted-foreground">
                      HeavyCRM was founded with the vision to simplify business communication across multiple channels.
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-white font-bold">2023</span>
                  </div>
                  <div className="card-elevated p-6 flex-1">
                    <h3 className="text-heading-4 text-foreground mb-2">WhatsApp Integration</h3>
                    <p className="text-body text-muted-foreground">
                      Launched our WhatsApp Business API integration, enabling businesses to reach customers on their preferred platform.
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-white font-bold">2024</span>
                  </div>
                  <div className="card-elevated p-6 flex-1">
                    <h3 className="text-heading-4 text-foreground mb-2">Global Expansion</h3>
                    <p className="text-body text-muted-foreground">
                      Expanded to serve customers in 150+ countries with multilingual support and regional compliance.
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 relative z-10">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="card-elevated p-6 flex-1">
                    <h3 className="text-heading-4 text-foreground mb-2">Industry Recognition</h3>
                    <p className="text-body text-muted-foreground">
                      Recognized as a leading communication platform by industry analysts and awarded for innovation excellence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-primary text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Ready to Join Our Journey?
            </h2>
            <p className="text-body-large text-muted-foreground mb-12 max-w-2xl mx-auto">
              Be part of the communication revolution. Start your free trial today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="btn-primary group min-w-[200px]">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="btn-secondary min-w-[200px]">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
