import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, TrendingUp, Sparkles, Building2, Users, CheckCircle2, ChevronRight, Zap, Shield, Cpu, Plus, Minus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-32">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 -top-40 -left-40 animate-pulse-slow"></div>
          <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-multiply opacity-40 top-40 right-0 animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border border-primary/20 bg-primary/10 text-primary mb-8 shadow-sm backdrop-blur-md hover:bg-primary/20 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Matchmaking is now live
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tighter text-text mb-8 leading-[1.1]">
              Find your next role with <br className="hidden md:block" />
              <span className="text-gradient">
                precision & speed.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
              Our AI analyzes your skills, experience, and potential to match you with opportunities where you'll thrive. Stop searching, start matching.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
              <Link to="/jobs">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-premium w-full sm:w-auto hover:scale-105 transition-transform duration-300">
                  Find Jobs <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-xl w-full sm:w-auto border-border hover:scale-105 transition-transform duration-300">
                  Post a Job
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="max-w-4xl mx-auto glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-shadow duration-500">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <Input placeholder="Job title, keywords, or company" className="pl-12 h-14 text-base bg-transparent border-none shadow-none focus:ring-0 rounded-xl transition-all" />
              </div>
              <div className="hidden md:block w-px h-8 bg-border self-center"></div>
              <div className="flex-1 relative border-t md:border-t-0 border-border group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <Input placeholder="City, state, or remote" className="pl-12 h-14 text-base bg-transparent border-none shadow-none focus:ring-0 rounded-xl transition-all" />
              </div>
              <Button className="h-14 px-8 m-1 rounded-xl">
                Search
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Companies - Infinite Marquee */}
      <section className="py-12 border-y border-border/50 bg-surface/50 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-text-muted mb-8 uppercase tracking-widest text-center">Trusted by innovative teams worldwide</p>
        <div className="w-full relative flex overflow-x-hidden">
          <motion.div 
            className="flex items-center gap-24 px-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          >
            {/* Duplicated for smooth infinite scroll */}
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><div className="w-8 h-8 bg-text rounded-md"></div>Acme Corp</div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><div className="w-8 h-8 rounded-full border-4 border-text"></div>GlobalTech</div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><div className="w-8 h-8 bg-text rotate-45"></div>Innovate</div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><Briefcase className="w-8 h-8" />Synergy</div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><div className="w-8 h-8 bg-text rounded-md"></div>Acme Corp</div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><div className="w-8 h-8 rounded-full border-4 border-text"></div>GlobalTech</div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><div className="w-8 h-8 bg-text rotate-45"></div>Innovate</div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-text"><Briefcase className="w-8 h-8" />Synergy</div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { label: 'Active Jobs', value: '10,000+', icon: Briefcase },
              { label: 'Companies', value: '500+', icon: Building2 },
              { label: 'Candidates', value: '50,000+', icon: Users },
              { label: 'Success Rate', value: '94%', icon: TrendingUp },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeIn} className="flex flex-col items-center group">
                <div className="h-16 w-16 rounded-2xl border border-border/50 bg-[hsl(var(--surface-hover))] flex items-center justify-center mb-6 text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-primary/30">
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className="text-4xl font-heading font-bold text-text mb-2 tracking-tight group-hover:text-primary transition-colors">{stat.value}</h3>
                <p className="text-text-muted font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">Why choose our platform?</h2>
            <p className="text-text-muted text-xl leading-relaxed">We've reimagined the job search experience with AI at the core, making it faster and more accurate for both candidates and companies.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Lightning Fast',
                icon: Zap,
                description: 'Our platform is optimized for speed. Find relevant jobs, apply in seconds, and track your applications without the lag.',
              },
              {
                title: 'Privacy First',
                icon: Shield,
                description: 'Your data is encrypted and secure. You control who sees your profile and when you are open to new opportunities.',
              },
              {
                title: 'Smart Filtering',
                icon: Search,
                description: 'Filter out the noise. Our advanced search algorithms ensure you only see roles that truly match your criteria.',
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card className="bg-background border-border/60 hover:shadow-premium hover:-translate-y-2 transition-all duration-300 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-text">{feature.title}</h3>
                    <p className="text-text-muted leading-relaxed flex-1">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <motion.div variants={fadeIn} className="flex-1 space-y-8">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border border-primary/30 bg-primary/10 text-primary uppercase tracking-widest">
                <Cpu className="w-3 h-3 mr-2" /> Powered by AI
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-text leading-[1.1]">
                Your personal AI career <span className="text-gradient">assistant.</span>
              </h2>
              <p className="text-xl text-text-muted leading-relaxed">
                Experience the future of recruitment. Our AI doesn't just match keywords; it understands context, potential, and cultural fit.
              </p>
              <ul className="space-y-4">
                {[
                  'Automated resume parsing and enhancement',
                  'Predictive success scoring for every application',
                  'Personalized skill gap analysis and learning paths',
                  'Smart interview preparation tailored to the role'
                ].map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-center text-text group cursor-default"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="mr-4 rounded-full bg-primary/10 p-1 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Button size="lg" variant="outline" className="mt-4 hover:bg-primary/5 hover:text-primary transition-colors">
                Explore AI Features <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex-1 w-full relative">
              {/* Mockup of AI feature */}
              <motion.div 
                className="relative z-10 glass-card p-6 rounded-2xl border border-border/50 shadow-2xl bg-surface/80 backdrop-blur-xl"
                whileHover={{ y: -10, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">Match Analysis</h4>
                    <p className="text-xs text-text-muted">Senior Frontend Engineer @ Vercel</p>
                  </div>
                  <Badge variant="success" className="ml-auto animate-bounce shadow-sm">94% Match</Badge>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-3/4 rounded-md bg-gradient-to-r from-border to-surface animate-pulse"></div>
                  <div className="h-4 w-full rounded-md bg-gradient-to-r from-border to-surface animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-4 w-5/6 rounded-md bg-gradient-to-r from-border to-surface animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm leading-relaxed relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
                    <strong>AI Insight:</strong> Your experience with React and modern build tools perfectly aligns with the core requirements. Highlighting your recent Next.js migration project will significantly boost your chances.
                  </motion.div>
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-text-muted text-lg">Everything you need to know about the product and billing.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {[
              { q: 'Is it completely free for job seekers?', a: 'Yes! Our platform is 100% free for candidates looking for their next role. You get full access to AI resume matching and job alerts.' },
              { q: 'How does the AI matching work?', a: 'Our AI analyzes millions of data points from job descriptions, successful hires, and your specific profile to calculate a compatibility score, ensuring you only see the most relevant opportunities.' },
              { q: 'Can companies see my profile if I\'m not actively looking?', a: 'You have complete control over your privacy. You can set your profile to hidden, open to offers, or actively looking in your dashboard settings.' }
            ].map((faq, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <div 
                  className={`p-6 rounded-2xl bg-background border transition-all cursor-pointer group ${activeFaq === idx ? 'border-primary shadow-sm shadow-primary/10' : 'border-border/50 hover:border-border'}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-semibold transition-colors ${activeFaq === idx ? 'text-primary' : 'text-text'}`}>{faq.q}</h3>
                    <motion.div animate={{ rotate: activeFaq === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      {activeFaq === idx ? 
                        <Minus className="h-5 w-5 text-primary" /> : 
                        <Plus className="h-5 w-5 text-text-muted group-hover:text-primary transition-colors" />
                      }
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-text-muted leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-text text-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 tracking-tighter">Ready to accelerate your career?</h2>
          <p className="text-surface/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have found their dream roles using our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-surface text-text hover:bg-surface-hover h-14 px-10 text-lg rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105">
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-transparent border border-surface/20 text-surface hover:bg-surface/10 hover:border-surface/30 shadow-none h-14 px-10 text-lg rounded-xl hover:scale-105 transition-transform duration-300">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
