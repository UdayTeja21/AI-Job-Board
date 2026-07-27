import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-premium border border-red-200 dark:border-red-800">
          <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-500" />
        </div>
        
        <h1 className="text-4xl font-heading font-black text-text tracking-tighter mb-4">Access Denied</h1>
        <p className="text-text-muted mb-8 leading-relaxed">
          You don't have the necessary permissions to view this page. If you believe this is an error, please contact support.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => window.history.back()} variant="outline" className="h-12 border-border/60">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <Button size="lg" asChild className="h-12 shadow-premium">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
