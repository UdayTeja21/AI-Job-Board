import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Target, Shield } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-surface border-b border-border py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 -z-10" />
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-text to-text-muted"
          >
            Revolutionizing the Job Search
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-text-muted leading-relaxed"
          >
            We are building the world's most advanced AI-powered platform to seamlessly connect 
            world-class talent with forward-thinking companies.
          </motion.p>
        </div>
      </div>

      {/* Core Values */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold text-text mb-4">Our Core Values</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Everything we do is guided by these principles, ensuring we provide the best experience for both candidates and recruiters.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Users, title: 'Human First', desc: 'AI empowers our process, but human connection is our ultimate goal.' },
            { icon: Globe, title: 'Global Reach', desc: 'Breaking down geographical barriers to connect talent worldwide.' },
            { icon: Target, title: 'Precision', desc: 'Delivering highly accurate job matches to save you valuable time.' },
            { icon: Shield, title: 'Integrity', desc: 'Maintaining the highest standards of data privacy and transparency.' }
          ].map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-surface border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <val.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">{val.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{val.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[hsl(var(--surface-hover))] border-y border-border py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Partner Companies' },
              { num: '50k+', label: 'Active Seekers' },
              { num: '10k+', label: 'Successful Hires' },
              { num: '99%', label: 'Match Accuracy' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-heading font-extrabold text-primary">{stat.num}</h4>
                <p className="text-text-muted font-medium uppercase tracking-wider text-xs md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
