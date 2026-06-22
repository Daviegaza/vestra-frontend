import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Phone, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Tabs from '../../components/ui/Tabs';
import { toast } from '../../store/toastStore';
import { validateEmail, validateRequired } from '../../lib/validation';

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailErr = validateEmail(email);
    const passErr = validateRequired(password, 'Password');
    if (emailErr || passErr) { setError(emailErr || passErr || ''); return; }

    const success = login(email, password);
    if (success) {
      toast.success('Welcome back!');
      const target = useAuthStore.getState().user?.role === 'buyer' ? '/market' : '/dashboard';
      navigate(target);
    } else {
      setError('Invalid email or password. Try one of the demo accounts.');
    }
  };

  const handleSendOtp = () => {
    if (phone.length >= 10) { setOtpSent(true); toast.info('OTP sent to your phone'); }
    else { setError('Enter a valid phone number'); }
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('OTP login is simulated. Use email/password with demo accounts.');
  };

  const emailTab = (
    <form onSubmit={handleEmailLogin} className="space-y-4 py-2">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(''); }}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
        required
      />
      {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer">
          <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /> Remember me
        </label>
        <Link to="/auth/forgot-password" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Forgot password?</Link>
      </div>
      <Button type="submit" className="w-full" size="lg">
        Sign In <ArrowRight size={16} />
      </Button>
    </form>
  );

  const otpTab = (
    <form onSubmit={handleOtpLogin} className="space-y-4 py-2">
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+254 7XX XXX XXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      {!otpSent ? (
        <Button type="button" variant="outline" className="w-full" onClick={handleSendOtp}>
          <Phone size={16} /> Send OTP
        </Button>
      ) : (
        <>
          <Input label="Enter OTP" type="text" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          <p className="text-xs text-gray-400">OTP login is simulated — use email/password instead.</p>
          <Button type="submit" className="w-full">Verify & Sign In</Button>
        </>
      )}
    </form>
  );

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-2xl text-emerald-600 dark:text-emerald-400 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <Building size={20} className="text-white" />
          </div>
          Vestra
        </Link>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your Vestra account</p>
      </div>

      <div className="glass-card p-6">
        <Tabs
          tabs={[
            { key: 'email', label: 'Email', content: emailTab },
            { key: 'otp', label: 'Phone OTP', content: otpTab },
          ]}
        />
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2.5 uppercase tracking-wider">Demo Accounts</p>
        <p className="text-[11px] text-gray-400 mb-2">Password: <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono">password</code></p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {['buyer@vestra.com', 'seller@vestra.com', 'landlord@vestra.com', 'tenant@vestra.com', 'agent@vestra.com', 'admin@vestra.com'].map((e) => (
            <button
              key={e}
              className="text-left cursor-pointer text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-2 py-1 rounded-lg transition-colors truncate"
              onClick={() => { setEmail(e); setPassword('password'); }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
