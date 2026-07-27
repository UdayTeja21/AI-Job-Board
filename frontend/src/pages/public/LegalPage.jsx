import React from 'react';
import { Shield, FileText, Cookie } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    lastUpdated: 'Last Updated: July 1, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        text: 'We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.'
      },
      {
        heading: '2. How We Use Your Information',
        text: 'We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, and develop safety features.'
      },
      {
        heading: '3. Sharing of Information',
        text: 'We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including with potential employers, recruiters, and third-party service providers who need access to such information to carry out work on our behalf.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    lastUpdated: 'Last Updated: July 1, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        text: 'By accessing and using our platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.'
      },
      {
        heading: '2. User Conduct',
        text: 'You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else\'s use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content or disrupting the normal flow of dialogue within our website.'
      },
      {
        heading: '3. Intellectual Property',
        text: 'The Service and its original content, features, and functionality are and will remain the exclusive property of AI Job Board and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.'
      }
    ]
  },
  cookie: {
    title: 'Cookie Policy',
    icon: Cookie,
    lastUpdated: 'Last Updated: July 1, 2026',
    sections: [
      {
        heading: '1. What Are Cookies',
        text: 'As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.'
      },
      {
        heading: '2. How We Use Cookies',
        text: 'We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.'
      },
      {
        heading: '3. Disabling Cookies',
        text: 'You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore, it is recommended that you do not disable cookies.'
      }
    ]
  }
};

const LegalPage = ({ type }) => {
  const content = CONTENT[type];
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-border py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 -z-10" />
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
            <Icon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-4 text-text">
            {content.title}
          </h1>
          <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
            {content.lastUpdated}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="bg-surface border-border shadow-premium">
          <CardContent className="p-8 sm:p-12 space-y-12">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-2xl font-bold font-heading text-text">
                  {section.heading}
                </h3>
                <p className="text-text-muted leading-relaxed text-base sm:text-lg">
                  {section.text}
                </p>
              </div>
            ))}
            
            <div className="pt-8 border-t border-border mt-12 text-center text-text-muted text-sm">
              <p>If you have any questions about this document, please <a href="/contact" className="text-primary hover:underline">contact us</a>.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalPage;
