import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PasswordStrengthMeter from '../../components/ui/PasswordStrengthMeter';
import { toast } from '../../store/toastStore';
import { validateEmail, validateKenyanPhone, validateRequired, validatePassword } from '../../lib/validation';
import type { UserRole } from '../../types';
import { useAuthStore } from '../../store/authStore';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'buyer', label: 'Regular User', desc: 'Browse, save, and buy property. No dashboard needed.' },
  { value: 'seller', label: 'Seller', desc: 'List and sell your properties with a full dashboard.' },
  { value: 'landlord', label: 'Landlord', desc: 'Manage units, tenants, rent collection & maintenance.' },
  { value: 'agent', label: 'Agent', desc: 'Manage listings, leads, commissions & grow your business.' },
];

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
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
    const user = {
      id: `user-${Date.now()}`,
      email,
      fullName: name,
      phone,
      role,
      isVerified: true,
      isKycVerified: false,
      location: '',
    };
    useAuthStore.setState({ user, isAuthenticated: true });
    localStorage.setItem('vestra_user', JSON.stringify(user));
    toast.success('Karibu! Account created successfully.');
    const target = role === 'buyer' ? '/market' : '/dashboard';
    setTimeout(() => navigate(target), 500);
    setLoading(false);
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
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Create Your Account</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1.5">
          <Sparkles size={14} className="text-emerald-500" />
          Start your property journey in Kenya
        </p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} error={errors.name || undefined} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email || undefined} required />
          <Input label="Phone" type="tel" placeholder="+254 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone || undefined} required />
          <Input label="Password" type="password" placeholder="Min 8 characters with a number" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password || undefined} required />
          <PasswordStrengthMeter password={password} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">I am a...</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
              ))}
            </select>
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
