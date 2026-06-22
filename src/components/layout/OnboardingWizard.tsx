import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, PlusCircle, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '../ui/Button';

interface Step {
  icon: typeof Search;
  title: string;
  description: string;
  cta: string;
  to: string;
}

const steps: Step[] = [
  { icon: Search, title: 'Browse Properties', description: 'Explore verified properties across all 47 counties. Filter by type, price, and location to find your perfect match.', cta: 'Start Browsing', to: '/market' },
  { icon: Shield, title: 'Verify Any Property', description: 'Use our AI verification to check title deeds, ownership history, and fraud risk before you commit.', cta: 'Verify a Property', to: '/verify' },
  { icon: PlusCircle, title: 'List Your Property', description: 'Selling or renting? List your property in minutes and reach thousands of verified buyers and tenants.', cta: 'Create Listing', to: '/dashboard/seller/add' },
  { icon: Check, title: 'You Are Ready!', description: 'Your Vestra account is set up. You can now browse, verify, list, and transact with confidence.', cta: 'Go to Dashboard', to: '/dashboard' },
];

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = steps[step];

  if (!open) return null;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate(current.to);
      onClose();
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-3 right-3">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="p-6 pt-12 space-y-6">
          {/* Progress */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
            <current.icon size={32} className="text-emerald-600" />
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{current.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{current.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {step > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={16} /> Back
              </Button>
            ) : (
              <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Skip</button>
            )}
            <Button onClick={handleNext}>
              {step < steps.length - 1 ? <>Next <ChevronRight size={16} /></> : current.cta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
