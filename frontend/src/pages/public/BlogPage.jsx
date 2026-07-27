import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'How AI is Changing the Hiring Landscape in 2026',
    excerpt: 'Artificial intelligence is no longer just a buzzword. Explore how machine learning algorithms are completely revolutionizing how recruiters find top talent and how seekers can stand out.',
    category: 'Industry Trends',
    author: 'Sarah Jenkins',
    date: 'Jul 15, 2026',
    readTime: '5 min read',
    imageGradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: 2,
    title: 'Top 10 Resume Tips to Beat the ATS (Applicant Tracking System)',
    excerpt: 'Modern Applicant Tracking Systems are smarter than ever. Learn the exact keywords, formatting tricks, and structural rules you need to follow to guarantee your resume reaches a human.',
    category: 'Career Advice',
    author: 'Michael Chang',
    date: 'Jul 12, 2026',
    readTime: '7 min read',
    imageGradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 3,
    title: 'The Rise of Hybrid Work: What Companies Need to Know',
    excerpt: 'Hybrid work is here to stay. Discover the best practices for managing distributed teams, maintaining company culture, and keeping employee engagement high in a remote-first world.',
    category: 'Recruiting',
    author: 'Elena Rodriguez',
    date: 'Jul 08, 2026',
    readTime: '6 min read',
    imageGradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    id: 4,
    title: 'Mastering the Technical Interview: A Comprehensive Guide',
    excerpt: 'Preparing for a technical interview can be daunting. We break down the most common algorithm questions, system design principles, and behavioral traits that top tech companies look for.',
    category: 'Interview Prep',
    author: 'David Kim',
    date: 'Jul 02, 2026',
    readTime: '10 min read',
    imageGradient: 'from-pink-500/20 to-rose-500/20'
  }
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-border py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 -z-10" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-6 text-text">
              Insights & Resources
            </h1>
            <p className="text-lg text-text-muted">
              Discover the latest industry trends, career advice, and recruiting strategies from our team of experts.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-surface border-border/60 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
                <div className={`h-48 w-full bg-gradient-to-br ${post.imageGradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  {/* Decorative pattern */}
                  <svg className="absolute opacity-20 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,100 L100,0 L100,100 Z" fill="currentColor" className="text-background" />
                  </svg>
                </div>
                
                <CardContent className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-text-muted font-medium">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-heading text-text mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                    <div className="flex flex-col gap-1 text-xs text-text-muted font-medium">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    </div>
                    <Link to="#" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
                      Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
