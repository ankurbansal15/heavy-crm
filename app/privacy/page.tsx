"use client"

import { PublicHeader } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Database, Globe } from 'lucide-react'
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative section-padding-small bg-gradient-hero">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-radial"></div>
        <div className="absolute inset-0 hero-overlay"></div>
        
        <div className="container-primary relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in hero-content-bg">
              <h1 className="text-display text-white hero-text-shadow mb-8">
                Privacy <span className="text-gradient-hero">Policy</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-8 max-w-2xl mx-auto leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <p className="text-body text-white/90 hero-text-shadow">
                Last updated: January 1, 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              
              {/* Overview */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Overview</h2>
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  HeavyCRM ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our communication platform and related services.
                </p>
                <p className="text-body text-muted-foreground leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with this policy. 
                  We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Information We Collect</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Personal Information</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-4">
                      We collect information you provide directly to us, such as:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground ml-4">
                      <li>Name, email address, and contact information</li>
                      <li>Account credentials and authentication information</li>
                      <li>Billing and payment information</li>
                      <li>Communication preferences and settings</li>
                      <li>Support requests and correspondence</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Usage Information</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-4">
                      We automatically collect certain information about how you use our services:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground ml-4">
                      <li>Log data including IP addresses, browser type, and device information</li>
                      <li>Usage patterns, features accessed, and time spent on our platform</li>
                      <li>Messages sent, delivery status, and engagement metrics</li>
                      <li>Performance data and error reports</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Customer Data</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      We process customer data on behalf of our clients, including contact lists, message content, 
                      and communication records. We act as a data processor for this information and handle it 
                      according to our clients' instructions and applicable data protection laws.
                    </p>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">How We Use Your Information</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-heading-4 text-foreground">Service Provision</h3>
                    </div>
                    <ul className="space-y-2 text-body text-muted-foreground">
                      <li>• Provide and maintain our services</li>
                      <li>• Process transactions and billing</li>
                      <li>• Provide customer support</li>
                      <li>• Send service-related communications</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-heading-4 text-foreground">Service Improvement</h3>
                    </div>
                    <ul className="space-y-2 text-body text-muted-foreground">
                      <li>• Analyze usage patterns and trends</li>
                      <li>• Improve our platform and features</li>
                      <li>• Develop new services and functionality</li>
                      <li>• Ensure platform security and reliability</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Information Sharing */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Information Sharing and Disclosure</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Service Providers</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      We may share information with trusted third-party service providers who assist us in operating our platform, 
                      such as cloud hosting providers, payment processors, and analytics services. These providers are contractually 
                      obligated to protect your information and use it only for the specified purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Legal Requirements</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      We may disclose information if required to do so by law or in good faith belief that such action is necessary to:
                      comply with legal obligations, protect and defend our rights or property, prevent fraud, or ensure user safety.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Business Transfers</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. 
                      We will provide notice before your information is transferred and becomes subject to a different privacy policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Data Security</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-body text-muted-foreground leading-relaxed mb-6">
                      We implement appropriate technical and organizational security measures to protect your information against 
                      unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-body text-foreground">AES-256 encryption</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-body text-foreground">24/7 security monitoring</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Database className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-body text-foreground">Regular security audits</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-body text-foreground">SOC 2 compliance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-glass p-6">
                    <h3 className="text-heading-4 text-foreground mb-4">Security Certifications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-body text-muted-foreground">SOC 2 Type II</span>
                        <span className="text-body-small text-green-600 font-medium">Certified</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-body text-muted-foreground">ISO 27001</span>
                        <span className="text-body-small text-green-600 font-medium">Certified</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-body text-muted-foreground">GDPR</span>
                        <span className="text-body-small text-green-600 font-medium">Compliant</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-body text-muted-foreground">CCPA</span>
                        <span className="text-body-small text-green-600 font-medium">Compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Your Rights and Choices</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-heading-4 text-foreground mb-2">Access and Portability</h4>
                      <p className="text-body text-muted-foreground">
                        Request access to and copies of your personal information in a portable format.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-heading-4 text-foreground mb-2">Rectification</h4>
                      <p className="text-body text-muted-foreground">
                        Request correction of inaccurate or incomplete personal information.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-heading-4 text-foreground mb-2">Erasure</h4>
                      <p className="text-body text-muted-foreground">
                        Request deletion of your personal information under certain circumstances.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-heading-4 text-foreground mb-2">Restriction</h4>
                      <p className="text-body text-muted-foreground">
                        Request limitation of processing of your personal information.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-heading-4 text-foreground mb-2">Objection</h4>
                      <p className="text-body text-muted-foreground">
                        Object to processing of your personal information for certain purposes.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-heading-4 text-foreground mb-2">Withdraw Consent</h4>
                      <p className="text-body text-muted-foreground">
                        Withdraw consent for processing where we rely on your consent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Contact Us</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">General Inquiries</h3>
                    <div className="space-y-2 text-body text-muted-foreground">
                      <p>Email: privacy@heavycrm.com</p>
                      <p>Phone: +1 (555) 123-4567</p>
                      <p>Address: 123 Business Ave, San Francisco, CA 94105</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">Data Protection Officer</h3>
                    <div className="space-y-2 text-body text-muted-foreground">
                      <p>Email: dpo@heavycrm.com</p>
                      <p>For GDPR-related inquiries and data subject requests</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Updates */}
              <div className="card-elevated p-8">
                <h2 className="text-heading-2 text-foreground mb-6">Policy Updates</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
                  We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
                
                <p className="text-body text-muted-foreground leading-relaxed">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. 
                  Your continued use of our services after any changes indicates your acceptance of the updated policy.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-heading-2 mb-6 text-foreground">
              Questions About Privacy?
            </h2>
            <p className="text-body-large text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our privacy team is here to help you understand how we protect your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="btn-primary min-w-[180px]">
                  Contact Us
                </Button>
              </Link>
              <Link href="/security">
                <Button variant="outline" className="btn-secondary min-w-[180px]">
                  View Security
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
