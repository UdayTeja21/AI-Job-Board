import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-premium transform -rotate-6">
          <FileQuestion className="w-12 h-12 text-primary transform rotate-6" />
        </div>
        
        <h1 className="text-6xl font-heading font-black text-text tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text mb-4">Page not found</h2>
        <p className="text-text-muted mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => window.history.back()} variant="outline" className="h-12 border-border/60">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <Button size="lg" asChild className="h-12 shadow-premium">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
