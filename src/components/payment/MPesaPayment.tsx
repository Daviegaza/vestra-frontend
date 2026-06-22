import { useState } from 'react';
import { Phone, CheckCircle, Loader2, Smartphone } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface MPesaPaymentProps {
  amount: number;
  currency?: string;
  description?: string;
  paybill?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MPesaPayment({ amount, description, paybill = '522522', onSuccess, onCancel }: MPesaPaymentProps) {
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [ref, setRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Enter a valid phone number (e.g., 0712 345 678)');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setRef(`MP${Date.now().toString(36).toUpperCase()}`);
      setStep('success');
    }, 2500);
  };

  const formatKES = (n: number) => `KES ${n.toLocaleString('en-KE')}`;

  return (
    <div className="space-y-4">
      {/* Step 1: Phone Input */}
      {step === 'input' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
            <Smartphone size={24} className="text-emerald-600" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">M-Pesa Payment</p>
              <p className="text-xs text-gray-500">You will receive an STK push on your phone</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{description || 'Amount'}</span>
            <span className="font-bold text-gray-900 dark:text-white">{formatKES(amount)}</span>
          </div>

          <Input
            label="M-Pesa Phone Number"
            type="tel"
            placeholder="0712 345 678"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(''); }}
            error={error}
          />

          <div className="flex gap-2">
            {onCancel && <Button variant="outline" type="button" onClick={onCancel} className="flex-1">Cancel</Button>}
            <Button type="submit" className="flex-1">Continue to M-Pesa</Button>
          </div>
        </form>
      )}

      {/* Step 2: Confirm */}
      {step === 'confirm' && (
        <div className="space-y-4">
          <div className="text-center space-y-2 py-4">
            <Phone size={40} className="mx-auto text-emerald-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Confirm Payment</h3>
            <p className="text-sm text-gray-500">An STK push will be sent to <strong>{phone}</strong></p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Paybill</span><span className="font-medium text-gray-900 dark:text-white">{paybill}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Account</span><span className="font-medium text-gray-900 dark:text-white">VESTRA</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-emerald-600">{formatKES(amount)}</span></div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg text-sm text-amber-700 dark:text-amber-400">
            Enter your M-Pesa PIN when prompted on your phone to complete payment.
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('input')} className="flex-1">Back</Button>
            <Button onClick={handleConfirm} className="flex-1 bg-mpesa hover:bg-green-600 border-0">Pay with M-Pesa</Button>
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
      {step === 'processing' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
            <Loader2 size={32} className="text-emerald-600 animate-spin" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Waiting for M-Pesa...</h3>
            <p className="text-sm text-gray-500 mt-1">Check your phone and enter your M-Pesa PIN</p>
          </div>
          <p className="text-xs text-gray-400">Do not close this page</p>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <div className="text-center py-8 space-y-4 animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Payment Successful!</h3>
            <p className="text-gray-500 text-sm mt-1">{formatKES(amount)} paid via M-Pesa</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm space-y-1">
            <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-mono font-medium text-gray-900 dark:text-white">{ref}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-gray-900 dark:text-white">{phone}</span></div>
          </div>
          {onSuccess && <Button onClick={onSuccess} className="w-full">Done</Button>}
        </div>
      )}
    </div>
  );
}

export function MPesaBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <span className={`inline-flex items-center gap-1 ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium`}>
      <Smartphone size={size === 'sm' ? 12 : 14} /> M-Pesa
    </span>
  );
}
