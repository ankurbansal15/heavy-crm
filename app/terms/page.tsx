"use client"

import { PublicHeader } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { FileText, Scale, Shield } from 'lucide-react'
import Link from "next/link"

export default function TermsPage() {
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
                Terms of <span className="text-gradient-hero">Service</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-8 max-w-2xl mx-auto leading-relaxed">
                Please read these terms carefully before using our services. They govern your use of HeavyCRM.
              </p>
              <p className="text-body text-white/90 hero-text-shadow">
                Last updated: January 1, 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              
              {/* Agreement */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Agreement to Terms</h2>
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you and HeavyCRM Inc. ("Company," "we," "us," or "our") 
                  regarding your use of our communication platform and related services (collectively, the "Service").
                </p>
                <p className="text-body text-muted-foreground leading-relaxed">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, 
                  then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </div>

              {/* Service Description */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Service Description</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  HeavyCRM provides a unified communication platform that enables businesses to send and manage messages across multiple channels 
                  including WhatsApp Business API, email, and SMS. Our Service includes:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Core Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground">
                      <li>WhatsApp Business API integration</li>
                      <li>Email campaign management</li>
                      <li>SMS messaging capabilities</li>
                      <li>Contact and list management</li>
                      <li>Analytics and reporting tools</li>
                      <li>Template and automation features</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Additional Services</h3>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground">
                      <li>API access and integrations</li>
                      <li>Customer support services</li>
                      <li>Training and consultation</li>
                      <li>Custom development (enterprise)</li>
                      <li>Compliance and security features</li>
                      <li>Multi-user account management</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* User Accounts */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">User Accounts and Registration</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Account Creation</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      To access certain features of the Service, you must register for an account. You agree to provide accurate, 
                      current, and complete information during registration and to update such information to keep it accurate and current.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Account Security</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-4">
                      You are responsible for safeguarding your account credentials and for all activities that occur under your account. 
                      You must:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground ml-4">
                      <li>Use a strong, unique password</li>
                      <li>Keep your login credentials confidential</li>
                      <li>Notify us immediately of any unauthorized use</li>
                      <li>Ensure your team members follow security best practices</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Account Termination</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      You may delete your account at any time. We may suspend or terminate your account if you violate these Terms 
                      or engage in prohibited activities. Upon termination, your right to use the Service will cease immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceptable Use */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Acceptable Use Policy</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">Prohibited Activities</h3>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground">
                      <li>Send spam, unsolicited, or bulk messages</li>
                      <li>Transmit illegal, harmful, or offensive content</li>
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe on intellectual property rights</li>
                      <li>Attempt to gain unauthorized access</li>
                      <li>Distribute malware or viruses</li>
                      <li>Harass, abuse, or harm others</li>
                      <li>Impersonate others or misrepresent identity</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">Content Guidelines</h3>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground">
                      <li>Ensure proper consent for messaging</li>
                      <li>Comply with anti-spam regulations</li>
                      <li>Respect recipient opt-out requests</li>
                      <li>Use appropriate content for your audience</li>
                      <li>Follow platform-specific guidelines</li>
                      <li>Maintain data accuracy and relevance</li>
                      <li>Respect privacy and confidentiality</li>
                      <li>Adhere to industry best practices</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Payment and Billing</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Subscription Plans</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      Our Service is offered through various subscription plans with different features and usage limits. 
                      Current pricing is available on our pricing page and may be updated from time to time with notice to existing customers.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Payment Processing</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-4">
                      By providing payment information, you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground ml-4">
                      <li>Authorize us to charge the applicable fees</li>
                      <li>Represent that you have the right to use the payment method</li>
                      <li>Agree to keep payment information current and accurate</li>
                      <li>Accept responsibility for all charges incurred</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Refunds and Cancellation</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      We offer a 30-day money-back guarantee for new subscriptions. You may cancel your subscription at any time, 
                      and cancellation will take effect at the end of your current billing period. Refunds are handled according to our refund policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Intellectual Property Rights</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">Our Content</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-4">
                      The Service and its original content, features, and functionality are owned by HeavyCRM and are protected by:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground">
                      <li>Copyright and trademark laws</li>
                      <li>Patent and trade secret protections</li>
                      <li>International intellectual property treaties</li>
                      <li>Other applicable legal protections</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">Your Content</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-4">
                      You retain ownership of content you submit to our Service. By using our Service, you grant us a license to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground">
                      <li>Process and deliver your messages</li>
                      <li>Store and backup your data</li>
                      <li>Provide customer support</li>
                      <li>Improve our services (in aggregated form)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Privacy and Data */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Privacy and Data Protection</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-body text-muted-foreground leading-relaxed mb-6">
                      Your privacy is important to us. Our collection and use of personal information in connection with the Service 
                      is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-body text-foreground">GDPR Compliant</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-body text-foreground">Data Processing Agreement</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-body text-foreground">CCPA Compliant</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">Data Responsibilities</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-4">
                      As our customer, you are responsible for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-body text-muted-foreground">
                      <li>Obtaining proper consent for data collection</li>
                      <li>Providing accurate privacy notices</li>
                      <li>Complying with applicable data protection laws</li>
                      <li>Ensuring data quality and relevance</li>
                      <li>Handling data subject requests appropriately</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Limitation of Liability</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  To the maximum extent permitted by applicable law, HeavyCRM shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                  or other intangible losses, resulting from your use of the Service.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Service Availability</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      While we strive for high availability, we do not guarantee that the Service will be uninterrupted or error-free. 
                      Scheduled maintenance and unexpected downtime may occur.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Third-Party Services</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      Our Service may integrate with third-party platforms. We are not responsible for the availability, 
                      functionality, or policies of these external services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Termination */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Termination</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Termination by You</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      You may terminate your account at any time by contacting us or using the account deletion feature in your dashboard. 
                      Upon termination, your access to the Service will cease, and your data will be deleted according to our data retention policy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Termination by Us</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      We may terminate or suspend your account immediately if you violate these Terms, engage in prohibited activities, 
                      or fail to pay applicable fees. We will provide notice when possible, except in cases of serious violations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-foreground mb-3">Effect of Termination</h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      Upon termination, your right to use the Service will cease immediately. Provisions that by their nature should 
                      survive termination will remain in effect, including ownership provisions and limitation of liability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Changes to Terms */}
              <div className="card-elevated p-8 mb-12">
                <h2 className="text-heading-2 text-foreground mb-6">Changes to Terms</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide 
                  at least 30 days' notice prior to any new terms taking effect. Material changes will be determined at our sole discretion.
                </p>
                
                <p className="text-body text-muted-foreground leading-relaxed">
                  By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms. 
                  If you do not agree to the new terms, you must stop using the Service.
                </p>
              </div>

              {/* Contact Information */}
              <div className="card-elevated p-8">
                <h2 className="text-heading-2 text-foreground mb-6">Contact Information</h2>
                
                <p className="text-body text-muted-foreground leading-relaxed mb-6">
                  If you have any questions about these Terms of Service, please contact us:
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">Legal Department</h3>
                    <div className="space-y-2 text-body text-muted-foreground">
                      <p>Email: legal@heavycrm.com</p>
                      <p>Phone: +1 (555) 123-4567</p>
                      <p>Address: 123 Business Ave, San Francisco, CA 94105</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-4">General Support</h3>
                    <div className="space-y-2 text-body text-muted-foreground">
                      <p>Email: support@heavycrm.com</p>
                      <p>For questions about using our Service</p>
                    </div>
                  </div>
                </div>
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
              Ready to Get Started?
            </h2>
            <p className="text-body-large text-muted-foreground mb-8 max-w-2xl mx-auto">
              By signing up, you agree to these Terms of Service and our Privacy Policy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="btn-primary min-w-[180px]">
                  Create Account
                </Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline" className="btn-secondary min-w-[180px]">
                  View Privacy Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
