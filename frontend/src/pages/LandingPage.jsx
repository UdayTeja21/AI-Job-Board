import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, TrendingUp, Sparkles, Building2, Users, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent -z-10" />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Matchmaking is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text mb-6">
              Find your next role with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                precision & speed.
              </span>
            </h1>
            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
              Our AI analyzes your skills, experience, and potential to match you with opportunities where you'll thrive. Stop searching, start matching.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-surface p-4 rounded-2xl shadow-glow border border-border flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
              <Input placeholder="Job title, keywords, or company" className="pl-10 h-12 text-base" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
              <Input placeholder="City, state, or remote" className="pl-10 h-12 text-base" />
            </div>
            <Button size="lg" className="h-12 px-8">
              Search Jobs
            </Button>
          </motion.div>

          <div className="mt-12 text-sm text-text-muted flex items-center justify-center gap-4 flex-wrap">
            <span>Popular:</span>
            {['React Developer', 'Product Designer', 'Data Scientist', 'Marketing Lead'].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full border border-border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Jobs', value: '10,000+', icon: Briefcase },
              { label: 'Companies', value: '500+', icon: Building2 },
              { label: 'Candidates', value: '50,000+', icon: Users },
              { label: 'Success Rate', value: '94%', icon: TrendingUp },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-text">{stat.value}</h3>
                <p className="text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose our platform?</h2>
            <p className="text-text-muted text-lg">We've reimagined the job search experience with AI at the core, making it faster and more accurate for both candidates and companies.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Resume Matching',
                description: 'Our proprietary AI analyzes your resume against job descriptions to predict your success score instantly.',
              },
              {
                title: 'Automated Summaries',
                description: 'Get the TL;DR of any job description. We highlight the core requirements, tech stack, and benefits.',
              },
              {
                title: 'Skill Gap Analysis',
                description: 'Discover exactly what skills you need to land your dream role, complete with personalized learning paths.',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-surface hover:shadow-lg transition-shadow border-none shadow-soft">
                <CardContent className="p-8 text-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-text-muted">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to accelerate your career?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream roles using our AI-powered platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
