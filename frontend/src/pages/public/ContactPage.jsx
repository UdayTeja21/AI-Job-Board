import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your message has been sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-4 text-text">Get in Touch</h1>
            <p className="text-lg text-text-muted">
              Have a question about our platform? Need support with your account? 
              Our team is here to help you navigate your journey.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <h3 className="text-2xl font-bold font-heading text-text mb-6">Contact Information</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Our Headquarters</h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  123 Innovation Drive<br />
                  Tech District<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Email Us</h4>
                <p className="text-text-muted text-sm mb-1">support@aijobboard.com</p>
                <p className="text-text-muted text-sm">sales@aijobboard.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Call Us</h4>
                <p className="text-text-muted text-sm">+1 (555) 123-4567</p>
                <p className="text-xs text-text-muted mt-1">Mon-Fri, 9am-6pm PST</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-surface border-border shadow-premium">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold font-heading text-text">Send a Message</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">Full Name</label>
                      <Input 
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">Email Address</label>
                      <Input 
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Subject</label>
                    <Input 
                      required
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Message</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-transparent text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-12 text-base rounded-xl">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
