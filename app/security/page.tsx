"use client"

import { PublicHeader } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, Database, Globe, Award, CheckCircle, FileText } from 'lucide-react'
import Link from "next/link"

export default function SecurityPage() {
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
                Enterprise-Grade <span className="text-gradient-hero">Security</span>
              </h1>
              <p className="text-body-large text-white/95 hero-text-shadow mb-12 max-w-3xl mx-auto leading-relaxed">
                Your data security is our top priority. We implement industry-leading security measures to protect your business communications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Overview */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Comprehensive Security Framework
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              We've built a multi-layered security infrastructure that protects your data at every level.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="card-elevated p-6 text-center group hover-lift animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">SOC 2 Type II</h3>
              <p className="text-body text-muted-foreground">
                Independently audited and certified for security, availability, and confidentiality.
              </p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">End-to-End Encryption</h3>
              <p className="text-body text-muted-foreground">
                All data is encrypted in transit and at rest using AES-256 encryption standards.
              </p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">GDPR Compliant</h3>
              <p className="text-body text-muted-foreground">
                Fully compliant with GDPR, CCPA, and other global privacy regulations.
              </p>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">Secure Infrastructure</h3>
              <p className="text-body text-muted-foreground">
                Hosted on enterprise-grade cloud infrastructure with 99.9% uptime SLA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-heading-1 mb-8 text-foreground">
                Data Protection & Privacy
              </h2>
              <p className="text-body-large text-muted-foreground mb-8 leading-relaxed">
                We implement comprehensive data protection measures to ensure your customer data 
                remains secure and private at all times.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Data Encryption</h3>
                    <p className="text-body text-muted-foreground">
                      All sensitive data is encrypted using industry-standard AES-256 encryption both in transit and at rest.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Access Controls</h3>
                    <p className="text-body text-muted-foreground">
                      Role-based access controls ensure only authorized personnel can access specific data and features.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Data Residency</h3>
                    <p className="text-body text-muted-foreground">
                      Choose where your data is stored with multiple data center locations across different regions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-heading-4 text-foreground mb-2">Regular Backups</h3>
                    <p className="text-body text-muted-foreground">
                      Automated, encrypted backups ensure your data is always recoverable and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl"></div>
                <div className="relative card-glass p-8">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-heading-3 text-foreground mb-4">99.9% Uptime</h3>
                    <p className="text-body text-muted-foreground">
                      Enterprise-grade reliability with redundant systems and failover protection.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="card-elevated p-4">
                      <div className="text-heading-4 text-foreground mb-1">256-bit</div>
                      <div className="text-body-small text-muted-foreground">AES Encryption</div>
                    </div>
                    <div className="card-elevated p-4">
                      <div className="text-heading-4 text-foreground mb-1">24/7</div>
                      <div className="text-body-small text-muted-foreground">Monitoring</div>
                    </div>
                    <div className="card-elevated p-4">
                      <div className="text-heading-4 text-foreground mb-1">Multi</div>
                      <div className="text-body-small text-muted-foreground">Data Centers</div>
                    </div>
                    <div className="card-elevated p-4">
                      <div className="text-heading-4 text-foreground mb-1">ISO</div>
                      <div className="text-body-small text-muted-foreground">27001 Certified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Compliance & Certifications
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              We maintain the highest standards of compliance with international regulations and industry certifications.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">SOC 2 Type II</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Independently audited security controls for confidentiality, integrity, and availability.
              </p>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">ISO 27001</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                International standard for information security management systems and processes.
              </p>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">GDPR Compliant</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Full compliance with European General Data Protection Regulation requirements.
              </p>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">CCPA Compliant</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                California Consumer Privacy Act compliance for enhanced data privacy rights.
              </p>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">HIPAA Ready</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Healthcare industry compliance for handling protected health information.
              </p>
            </div>
            <div className="card-elevated p-8 text-center group hover-lift animate-slide-up" style={{animationDelay: '0.5s'}}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading-4 mb-4 text-foreground">PCI DSS</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Payment Card Industry Data Security Standard for secure payment processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Monitoring */}
      <section className="section-padding bg-muted/30">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              24/7 Security Monitoring
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Our dedicated security team monitors all systems around the clock to detect and respond to any potential threats.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-elevated p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-heading-4 text-foreground">Threat Detection</h3>
              </div>
              <ul className="space-y-3 text-body text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Real-time intrusion detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Automated threat response</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Advanced behavioral analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Machine learning anomaly detection</span>
                </li>
              </ul>
            </div>
            <div className="card-elevated p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-heading-4 text-foreground">Incident Response</h3>
              </div>
              <ul className="space-y-3 text-body text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Dedicated security operations center</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Immediate incident notification</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Rapid containment and remediation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Post-incident analysis and reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Resources */}
      <section className="section-padding bg-background">
        <div className="container-primary">
          <div className="text-center mb-20">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Security Resources
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              Access our security documentation, policies, and resources to understand how we protect your data.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-elevated p-6 text-center group hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-heading-4 text-foreground mb-3">Security Whitepaper</h3>
              <p className="text-body text-muted-foreground mb-4">
                Detailed overview of our security architecture and practices.
              </p>
              <Button variant="outline" className="btn-secondary">
                Download PDF
              </Button>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-heading-4 text-foreground mb-3">Compliance Reports</h3>
              <p className="text-body text-muted-foreground mb-4">
                Access our latest SOC 2 and compliance audit reports.
              </p>
              <Button variant="outline" className="btn-secondary">
                View Reports
              </Button>
            </div>
            <div className="card-elevated p-6 text-center group hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-heading-4 text-foreground mb-3">Privacy Policy</h3>
              <p className="text-body text-muted-foreground mb-4">
                Learn how we collect, use, and protect your personal information.
              </p>
              <Link href="/privacy">
                <Button variant="outline" className="btn-secondary">
                  Read Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-primary text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-heading-1 mb-6 text-foreground">
              Questions About Security?
            </h2>
            <p className="text-body-large text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our security team is here to answer any questions about our security practices and compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact">
                <Button size="lg" className="btn-primary group min-w-[200px]">
                  Contact Security Team
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="btn-secondary min-w-[200px]">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
