import { useState, useEffect } from 'react';
import { Phone, Loader2, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { usePaymentStore } from '../../store/paymentStore';

interface STKPushSimulatorProps {
  amount: number;
  description: string;
  paybill?: string;
  accountRef?: string;
  onSuccess?: (receipt: string) => void;
  onCancel?: () => void;
}

export default function STKPushSimulator({ amount, description, paybill = '522522', accountRef = 'VESTRA', onSuccess, onCancel }: STKPushSimulatorProps) {
  const [step, setStep] = useState<'input' | 'push_sent' | 'pin_prompt' | 'processing' | 'success' | 'failed'>('input');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');
  const [countdown, setCountdown] = useState(30);
  const { initiateSTKPush, completeSTKPush } = usePaymentStore();

  useEffect(() => {
    if (step === 'push_sent' && countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
    if (step === 'push_sent' && countdown === 0) {
      setStep('failed');
      setError('STK push timed out. Please try again.');
    }
  }, [step, countdown]);

  const handleSendSTK = () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 9) {
      setError('Enter a valid phone number');
      return;
    }
    setStep('push_sent');
    setCountdown(30);
    setReceipt(`MP${Date.now().toString(36).toUpperCase()}`);
    initiateSTKPush(cleaned, amount, description);
  };

  const handleEnterPin = () => {
    setStep('pin_prompt');
  };

  const handleSubmitPin = () => {
    if (pin.length < 4) {
      setError('Enter a valid M-Pesa PIN');
      return;
    }
    setStep('processing');
    setTimeout(() => {
      completeSTKPush(receipt, receipt);
      setStep('success');
      onSuccess?.(receipt);
    }, 2000 + Math.random() * 1500);
  };

  const handleCancelPin = () => {
    setStep('failed');
    setError('PIN entry cancelled');
  };

  const formatKES = (n: number) => `KES ${n.toLocaleString('en-KE')}`;

  return (
    <div className="space-y-4">
      {/* Step 1: Phone Input */}
      {step === 'input' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSendSTK(); }} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
            <Phone size={24} className="text-emerald-600" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">M-Pesa STK Push</p>
              <p className="text-xs text-gray-500">You'll receive a popup on your phone to enter your PIN</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Paybill</span><span className="font-medium text-gray-900 dark:text-white">{paybill}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Account</span><span className="font-medium text-gray-900 dark:text-white">{accountRef}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-emerald-600">{formatKES(amount)}</span></div>
          </div>

          <Input label="M-Pesa Phone Number" type="tel" placeholder="0712 345 678" value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }} error={error} />
          <div className="flex gap-2">
            {onCancel && <Button variant="outline" type="button" onClick={onCancel} className="flex-1">Cancel</Button>}
            <Button type="submit" className="flex-1">Send STK Push</Button>
          </div>
        </form>
      )}

      {/* Step 2: STK Push Sent - Waiting */}
      {step === 'push_sent' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto">
            <Phone size={32} className="text-amber-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">STK Push Sent</h3>
            <p className="text-sm text-gray-500 mt-1">Check your phone <strong>{phone}</strong></p>
            <p className="text-xs text-gray-400 mt-1">Enter your M-Pesa PIN to complete payment</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>Expires in {countdown}s</span>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => setStep('input')}>Change Number</Button>
            <Button size="sm" onClick={handleEnterPin}>Simulate PIN Entry</Button>
          </div>
        </div>
      )}

      {/* Step 3: PIN Entry */}
      {step === 'pin_prompt' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmitPin(); }} className="space-y-4">
          <div className="text-center py-4 space-y-2">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Shield size={32} className="text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Enter M-Pesa PIN</h3>
            <p className="text-sm text-gray-500">For {formatKES(amount)} to {accountRef}</p>
          </div>
          <Input label="M-Pesa PIN" type="password" placeholder="****" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value); setError(''); }} error={error} />
          <p className="text-xs text-gray-400">Enter any PIN to simulate. Use 0000 to simulate a failed transaction.</p>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={handleCancelPin} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Confirm Payment</Button>
          </div>
        </form>
      )}

      {/* Step 4: Processing */}
      {step === 'processing' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
            <Loader2 size={32} className="text-emerald-600 animate-spin" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Processing Payment...</h3>
            <p className="text-sm text-gray-500 mt-1">Confirming with M-Pesa</p>
          </div>
          <p className="text-xs text-gray-400">Please wait</p>
        </div>
      )}

      {/* Step 5: Success */}
      {step === 'success' && (
        <div className="text-center py-6 space-y-4 animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Payment Successful!</h3>
            <p className="text-sm text-gray-500 mt-1">{formatKES(amount)} paid via M-Pesa</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm space-y-1 text-left">
            <div className="flex justify-between"><span className="text-gray-500">Receipt</span><span className="font-mono font-medium text-gray-900 dark:text-white">{receipt}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-gray-900 dark:text-white">{phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-gray-900 dark:text-white">{new Date().toLocaleString()}</span></div>
          </div>
          {onSuccess && <Button onClick={() => onSuccess(receipt)} className="w-full">Done</Button>}
        </div>
      )}

      {/* Step 6: Failed */}
      {step === 'failed' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <XCircle size={32} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Payment Failed</h3>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setStep('input'); setError(''); }} className="flex-1">Try Again</Button>
            {onCancel && <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
