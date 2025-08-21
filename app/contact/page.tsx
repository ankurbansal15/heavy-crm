"use client"

import { PublicHeader } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, MessageCircle, HeadphonesIcon } from 'lucide-react'

export default function ContactPage() {
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
                Get in <span className="text-gradient-hero">Touch</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-12 max-w-2xl mx-auto leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Email Support</h3>
              <p className="text-body text-muted-foreground mb-4">
                Get help via email for any questions or technical support.
              </p>
              <p className="text-body font-medium text-primary">
                support@heavycrm.com
              </p>
              <p className="text-body-small text-muted-foreground mt-2">
                Response time: 2-4 hours
              </p>
            </div>
            
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Phone Support</h3>
              <p className="text-body text-muted-foreground mb-4">
                Speak directly with our support team for urgent matters.
              </p>
              <p className="text-body font-medium text-primary">
                +1 (555) 123-4567
              </p>
              <p className="text-body-small text-muted-foreground mt-2">
                Mon-Fri: 9AM-6PM PST
              </p>
            </div>
            
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Live Chat</h3>
              <p className="text-body text-muted-foreground mb-4">
                Chat with our team in real-time for instant assistance.
              </p>
              <Button className="btn-primary">
                Start Chat
              </Button>
              <p className="text-body-small text-muted-foreground mt-2">
                Available 24/7
              </p>
            </div>
          </div>

          {/* Contact Form and Office Info */}
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-slide-in-left">
              <div className="card-elevated p-8">
                <div className="mb-8">
                  <h2 className="text-heading-2 text-foreground mb-4">Send us a Message</h2>
                  <p className="text-body text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-body font-medium text-foreground">Name *</label>
                      <Input id="name" placeholder="Your full name" className="input-primary" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-body font-medium text-foreground">Email *</label>
                      <Input id="email" type="email" placeholder="your@email.com" className="input-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-body font-medium text-foreground">Company</label>
                    <Input id="company" placeholder="Your company name" className="input-primary" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-body font-medium text-foreground">Subject *</label>
                    <Input id="subject" placeholder="How can we help?" className="input-primary" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-body font-medium text-foreground">Message *</label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your requirements..."
                      rows={6}
                      className="input-primary resize-none"
                    />
                  </div>
                  <Button type="submit" className="btn-primary w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Office Information */}
            <div className="animate-slide-in-right space-y-8">
              <div>
                <h2 className="text-heading-2 text-foreground mb-8">Our Offices</h2>
                
                <div className="space-y-6">
                  <div className="card-elevated p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-4 text-foreground mb-2">San Francisco</h3>
                        <p className="text-body text-muted-foreground mb-2">
                          123 Business Avenue<br />
                          San Francisco, CA 94105<br />
                          United States
                        </p>
                        <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Mon-Fri: 9AM-6PM PST</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-elevated p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-4 text-foreground mb-2">Mumbai</h3>
                        <p className="text-body text-muted-foreground mb-2">
                          456 Tech Park<br />
                          Bandra Kurla Complex<br />
                          Mumbai, Maharashtra 400051<br />
                          India
                        </p>
                        <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Mon-Fri: 10AM-7PM IST</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <HeadphonesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Support Hours</h3>
                    <div className="space-y-2 text-body text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Email Support:</span>
                        <span className="font-medium">24/7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone Support:</span>
                        <span className="font-medium">Mon-Fri, 9AM-6PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Live Chat:</span>
                        <span className="font-medium">24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
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
              Quick answers to common questions about our platform and services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">How quickly do you respond to support requests?</h3>
              <p className="text-body text-muted-foreground">
                We typically respond to email support within 2-4 hours during business hours. For urgent matters, please use our phone or live chat support.
              </p>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">Do you offer custom integrations?</h3>
              <p className="text-body text-muted-foreground">
                Yes, we offer custom integrations for enterprise customers. Contact our sales team to discuss your specific requirements.
              </p>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">Is there technical support available?</h3>
              <p className="text-body text-muted-foreground">
                Absolutely! Our technical support team is available to help with setup, configuration, and troubleshooting any issues you may encounter.
              </p>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-heading-4 text-foreground mb-3">Can I schedule a demo?</h3>
              <p className="text-body text-muted-foreground">
                Yes, we'd be happy to show you our platform. Contact us to schedule a personalized demo that fits your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

