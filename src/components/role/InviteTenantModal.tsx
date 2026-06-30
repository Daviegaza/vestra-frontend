import { useState } from 'react';
import { UserPlus, Loader2, Send } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toast } from '../../store/toastStore';
import { createInvite } from '../../services/invites';

interface Props {
  open: boolean;
  onClose: () => void;
  unitId?: string;
  unitTitle?: string;
  defaultRent?: number;
  onSent?: () => void;
}

export default function InviteTenantModal({ open, onClose, unitId, unitTitle, defaultRent, onSent }: Props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rent, setRent] = useState<string>(defaultRent ? String(defaultRent) : '');
  const [deposit, setDeposit] = useState<string>(defaultRent ? String(defaultRent * 2) : '');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10));
  const [terms, setTerms] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!unitId) { toast.error('Pick a unit first'); return; }
    if (!email && !phone) { toast.error('Enter tenant email or phone'); return; }
    if (!rent) { toast.error('Enter monthly rent'); return; }
    setBusy(true);
    try {
      await createInvite({
        unitId,
        tenantEmail: email || undefined,
        tenantPhone: phone || undefined,
        rentAmount: Number(rent),
        deposit: Number(deposit || rent),
        startDate,
        endDate,
        terms,
      });
      toast.success('Invitation sent. The tenant will see it on their dashboard.');
      onSent?.();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send invite');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md" variant="bottom" title={unitTitle ? `Invite tenant — ${unitTitle}` : 'Invite tenant'}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 p-3 text-sm text-orange-700 dark:text-orange-300">
          <UserPlus size={16} className="mt-0.5 shrink-0" />
          <p>Send a digital lease invite. The tenant gets a notification on their Vestra dashboard. The tenant role activates automatically when they accept.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Tenant email" type="email" placeholder="tenant@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Tenant phone" type="tel" placeholder="+254 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <p className="text-xs text-gray-500 -mt-2">Either email or phone is required.</p>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Monthly rent (KES)" type="number" placeholder="45000" value={rent} onChange={(e) => setRent(e.target.value)} required />
          <Input label="Deposit (KES)" type="number" placeholder="90000" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Lease start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="Lease end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>

        <div className="w-full space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lease terms (optional)</label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={3}
            placeholder="Pet policy, utility responsibility, notice period…"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={busy} className="bg-violet-600 hover:bg-violet-700 text-white">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Send invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
}
