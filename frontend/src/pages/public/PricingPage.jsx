import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Basic',
    description: 'Perfect for small companies just starting out.',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Post up to 2 active jobs',
      'Basic candidate filtering',
      'Standard support',
      'Company profile'
    ],
    limitations: [
      'No AI matching',
      'No ATS board access',
      'No featured listings'
    ],
    recommended: false,
    cta: 'Get Started Free'
  },
  {
    name: 'Pro',
    description: 'For growing teams who need advanced tools.',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      'Post up to 15 active jobs',
      'Advanced AI matching & ranking',
      'Full ATS board access',
      'Priority email support',
      'Custom company branding'
    ],
    limitations: [
      'No dedicated account manager'
    ],
    recommended: true,
    cta: 'Start Pro Trial'
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for high-volume hiring.',
    monthlyPrice: 299,
    annualPrice: 249,
    features: [
      'Unlimited active job posts',
      'Advanced AI matching & ranking',
      'Full ATS board access',
      '24/7 priority phone support',
      'Dedicated account manager',
      'Custom API integrations',
      'Multiple team seats'
    ],
    limitations: [],
    recommended: false,
    cta: 'Contact Sales'
  }
];

const PricingPage = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-border py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-accent/5 -z-10" />
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold mb-6 text-text">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10">
            Whether you're hiring your first employee or scaling a global team, 
            we have a plan that fits your exact needs.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!annual ? 'text-text' : 'text-text-muted'}`}>Monthly</span>
            <button 
              onClick={() => setAnnual(!annual)}
              className="relative w-16 h-8 rounded-full bg-[hsl(var(--surface-hover))] border border-border shadow-inner p-1 transition-colors"
            >
              <div className={`absolute top-1 bottom-1 w-6 bg-primary rounded-full shadow-sm transition-all duration-300 ${annual ? 'left-[calc(100%-1.75rem)]' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2 ${annual ? 'text-text' : 'text-text-muted'}`}>
              Annually <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Save 20%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full flex flex-col transition-all duration-300 ${plan.recommended ? 'border-primary shadow-[0_8px_30px_hsl(var(--primary)/0.15)] scale-105 z-0' : 'border-border/60 bg-surface shadow-sm'}`}>
                <CardContent className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold font-heading text-text mb-2">{plan.name}</h3>
                  <p className="text-text-muted text-sm mb-6 h-10">{plan.description}</p>
                  
                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-text font-heading">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-text-muted font-medium mb-1">/mo</span>
                  </div>
                  
                  <Link to="/register" className="w-full">
                    <Button 
                      variant={plan.recommended ? 'primary' : 'outline'} 
                      className={`w-full h-12 text-base rounded-xl mb-8 ${!plan.recommended && 'bg-[hsl(var(--surface-hover))]'}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="space-y-6 flex-grow">
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <span className="text-sm font-medium text-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-border/50">
                        {plan.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-start gap-3 opacity-60">
                            <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <X className="w-3.5 h-3.5 text-rose-500" />
                            </div>
                            <span className="text-sm font-medium text-text">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
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

export default PricingPage;
