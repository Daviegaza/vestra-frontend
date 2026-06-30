import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, ArrowRight, Sparkles, Shield, Home, Users, Briefcase } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PasswordStrengthMeter from '../../components/ui/PasswordStrengthMeter';
import { toast } from '../../store/toastStore';
import { validateEmail, validateKenyanPhone, validateRequired, validatePassword } from '../../lib/validation';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = {
      name: validateRequired(name, 'Name'),
      email: validateEmail(email),
      phone: validateKenyanPhone(phone),
      password: validatePassword(password),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      await useAuthStore.getState().registerAsync({ email, password, fullName: name, phone });
      toast.success('Karibu! Your account is ready.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-2xl text-emerald-600 dark:text-emerald-400 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <Building size={20} className="text-white" />
          </div>
          Vestra
        </Link>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Join Vestra</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1.5">
          <Sparkles size={14} className="text-emerald-500" />
          One account. Add landlord, agent, tenant roles anytime.
        </p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} error={errors.name || undefined} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email || undefined} required />
          <Input label="Phone" type="tel" placeholder="+254 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone || undefined} required />
          <Input label="Password" type="password" placeholder="Min 8 characters with a number" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password || undefined} required />
          <PasswordStrengthMeter password={password} />

          <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-900/10 p-3">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield size={12} /> What you unlock later
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><Home size={12} className="text-emerald-600" /> Landlord</span>
              <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-emerald-600" /> Agent</span>
              <span className="flex items-center gap-1.5"><Users size={12} className="text-emerald-600" /> Tenant</span>
              <span className="flex items-center gap-1.5"><Building size={12} className="text-emerald-600" /> Seller</span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight size={16} />}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
