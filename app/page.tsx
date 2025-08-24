"use client"

import { useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Mail, MessageSquare, Shield, BarChart3, Users, Star, ArrowRight, Play, CheckCircle, Globe, Zap, HeartHandshake } from 'lucide-react'
import { PublicHeader } from "@/components/public-header"
import Image from 'next/image'
import DashboardLight from '../public/dashboard-light-mode.png'
import DashboardDark from '../public/dashboard-dark-mode.png'
export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) {
    return null
  }

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
          <div className="text-center max-w-5xl mx-auto">
            <div className="animate-fade-in hero-content-bg">
              <h1 className="text-display text-white hero-text-shadow mb-8">
                Unified Communication <br />
                <span className="text-gradient-hero">Platform for Business</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your customer relationships with our all-in-one messaging solution. Connect through WhatsApp, Email, and SMS with enterprise-grade security and powerful analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Button size="lg" className="btn-primary group min-w-[200px]">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" className="btn-hero-secondary group min-w-[200px]">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 mb-16 text-white/90">
                <div className="flex items-center gap-2 hero-text-shadow">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2 hero-text-shadow">
                  <Users className="h-5 w-5 text-green-300" />
                  <span className="text-sm font-medium">10,000+ Users</span>
                </div>
                <div className="flex items-center gap-2 hero-text-shadow">
                  <Shield className="h-5 w-5 text-blue-300" />
                  <span className="text-sm font-medium">Enterprise Secure</span>
                </div>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="animate-slide-up relative">
              <div className="relative mx-auto max-w-6xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl"></div>
                <div className="relative card-glass p-4">
                  <Image 
                    src={DashboardLight}
                    className="rounded-xl shadow-2xl border border-white/20 dark:hidden w-full"
                    alt="Dashboard Preview Light Mode"
                  />
                  <Image 
                    src={DashboardDark}
                    className="rounded-xl shadow-2xl border border-white/20 hidden dark:block w-full"
                    alt="Dashboard Preview Dark Mode"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Everything You Need to Manage Communications
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Our platform provides all the tools you need to manage customer communications effectively with cutting-edge technology and intuitive design.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">WhatsApp Business</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Send bulk messages and manage conversations through WhatsApp Business API with advanced automation and analytics.
              </p>
              <div className="mt-6 flex items-center justify-center text-primary font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Email Campaigns</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Create and send personalized email campaigns with rich templates, A/B testing, and detailed performance tracking.
              </p>
              <div className="mt-6 flex items-center justify-center text-primary font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">SMS Integration</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Reach customers instantly with SMS messaging integration, delivery reports, and intelligent scheduling.
              </p>
              <div className="mt-6 flex items-center justify-center text-primary font-medium">
                <span>Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-heading-1 mb-8 text-foreground">
                Powerful Features for Modern Businesses
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 mb-2 text-foreground">Advanced Contact Management</h3>
                    <p className="text-body text-muted-foreground">
                      Efficiently organize, segment, and manage your contacts with smart tagging, custom fields, and automated workflows.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 mb-2 text-foreground">Enterprise Security</h3>
                    <p className="text-body text-muted-foreground">
                      Bank-level encryption, SOC 2 compliance, and advanced security features to protect your business communications.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 mb-2 text-foreground">Real-time Analytics</h3>
                    <p className="text-body text-muted-foreground">
                      Comprehensive reporting with real-time insights, conversion tracking, and performance optimization tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl"></div>
                <div className="relative card-glass p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Global Reach</h4>
                      <p className="text-sm text-muted-foreground">Connect with customers worldwide</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Lightning Fast</h4>
                      <p className="text-sm text-muted-foreground">Instant message delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <HeartHandshake className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">24/7 Support</h4>
                      <p className="text-sm text-muted-foreground">Always here to help you succeed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding-small bg-gradient-primary">
        <div className="container-primary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-scale-in">
              <div className="text-heading-1 text-white font-bold mb-2">10K+</div>
              <div className="text-body text-white/80">Happy Customers</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="text-heading-1 text-white font-bold mb-2">1M+</div>
              <div className="text-body text-white/80">Messages Sent</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="text-heading-1 text-white font-bold mb-2">99.9%</div>
              <div className="text-body text-white/80">Uptime SLA</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="text-heading-1 text-white font-bold mb-2">150+</div>
              <div className="text-body text-white/80">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-primary text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Ready to Transform Your Communication?
            </h2>
            <p className="text-body-large text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of businesses who trust our platform to manage their customer communications effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button size="lg" className="btn-primary group min-w-[200px]">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary min-w-[200px]">
                Schedule Demo
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding-small bg-muted/50">
        <div className="container-primary">
          <div className="max-w-2xl mx-auto text-center card-elevated p-12">
            <h2 className="text-heading-3 text-foreground mb-4">
              Stay Updated with Industry Insights
            </h2>
            <p className="text-body text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest communication trends, best practices, and product updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="input-primary flex-1"
              />
              <Button className="btn-primary">
                Subscribe
              </Button>
            </form>
            <p className="text-body-small text-muted-foreground mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding bg-background border-t border-border">
        <div className="container-primary">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-heading-4 text-foreground">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-body text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-body text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="text-body text-muted-foreground hover:text-primary transition-colors">Integrations</Link></li>
                <li><Link href="/security" className="text-body text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-heading-4 text-foreground">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-body text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-body text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-body text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-body text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-heading-4 text-foreground">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-body text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="text-body text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="text-body text-muted-foreground hover:text-primary transition-colors">API Reference</Link></li>
                <li><Link href="/status" className="text-body text-muted-foreground hover:text-primary transition-colors">System Status</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-heading-4 text-foreground">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-body text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-body text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-body text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
                <li><Link href="/gdpr" className="text-body text-muted-foreground hover:text-primary transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">HeavyCRM</span>
            </div>
            <p className="text-body-small text-muted-foreground">
              &copy; 2024 HeavyCRM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

