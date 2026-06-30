import { useState } from 'react';
import { Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import {
  PAYMENT_METHODS, makeSandboxRef,
  type PaymentMethod, type PaymentMethodEntry,
} from '../../lib/paymentMethods';

interface Props {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  context: string;
  onPay: (method: PaymentMethod, ref: string) => Promise<void> | void;
}

export default function PaymentMethodPicker({ open, onClose, amount, currency = 'KES', context, onPay }: Props) {
  const [selected, setSelected] = useState<PaymentMethodEntry | null>(null);
  const [extra, setExtra] = useState('');
  const [busy, setBusy] = useState(false);

  const handleClose = () => {
    setSelected(null);
    setExtra('');
    onClose();
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const ref = extra || makeSandboxRef(selected.method);
      await onPay(selected.method, ref);
      handleClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      variant="bottom"
      title={selected ? `Pay with ${selected.label}` : 'Choose payment method'}
    >
      <div className="space-y-3 pb-2">
        <div className="flex items-baseline justify-between rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">{context}</span>
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{currency} {amount.toLocaleString()}</span>
        </div>

        {!selected ? (
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.method}
                  onClick={() => setSelected(m)}
                  className="w-full flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 p-3 text-left transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {m.label}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">{m.region}</span>
                      {m.liveReady && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Live
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {m.tagline}{m.feePct > 0 ? ` · ${m.feePct}% fee` : ' · no fee'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 shrink-0" />
                </button>
              );
            })}
            <p className="text-[11px] text-gray-400 text-center pt-1">
              Production replaces sandbox confirm with the provider's real-time prompt.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">{selected.prompt}</p>
            {(selected.method === 'mpesa' || selected.method === 'airtel_money' || selected.method === 'equitel') && (
              <Input
                label="Phone number"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
              />
            )}
            {selected.method === 'card' && (
              <Input
                label="Card number"
                placeholder="4242 4242 4242 4242"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                hint="Sandbox — any number accepted. Production uses tokenized iframe (Stripe/Flutterwave)."
              />
            )}
            {selected.method === 'bank_transfer' && (
              <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 text-xs space-y-1">
                <p className="font-semibold text-gray-700 dark:text-gray-300">Vestra Settlement Account</p>
                <p className="text-gray-500">Bank: KCB · Branch: Sarit · Account: 1234567890</p>
                <p className="text-gray-500">SWIFT: KCBLKENX · Use your email as reference.</p>
              </div>
            )}
            {selected.method === 'paypal' && (
              <Input label="PayPal email" type="email" value={extra} onChange={(e) => setExtra(e.target.value)} />
            )}
            {selected.method === 'pesalink' && (
              <Input label="Sending bank" placeholder="e.g. Equity Bank" value={extra} onChange={(e) => setExtra(e.target.value)} />
            )}
            {(selected.method === 'flutterwave' || selected.method === 'intasend') && (
              <Input label="Email for receipt" type="email" value={extra} onChange={(e) => setExtra(e.target.value)} />
            )}
            {selected.method === 'cash' && (
              <Input label="Note (optional)" placeholder="Paid at office, receipt #" value={extra} onChange={(e) => setExtra(e.target.value)} />
            )}

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setSelected(null)} disabled={busy}>Back</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleConfirm} disabled={busy}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Confirm payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
