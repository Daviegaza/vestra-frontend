import { useState } from 'react';
import { Clock, Loader2, Send } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toast } from '../../store/toastStore';
import { requestExtension, type ExtensionKind } from '../../services/extensions';

interface Props {
  open: boolean;
  onClose: () => void;
  kind?: ExtensionKind;
  unitId?: string;
  amount?: number;
  approverId?: string;
  approverName?: string;
  originalDue?: string;
  onSent?: () => void;
}

export default function ExtensionRequestModal({
  open, onClose, kind = 'rent', unitId, amount = 0, approverId, approverName, originalDue, onSent,
}: Props) {
  const [reason, setReason] = useState('');
  const [requestedDue, setRequestedDue] = useState<string>(() => {
    const base = originalDue ? new Date(originalDue) : new Date();
    return new Date(base.getTime() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  });
  const [amt, setAmt] = useState<string>(String(amount || ''));
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim() || reason.length < 5) { toast.error('Tell them why — at least a sentence'); return; }
    if (!amt || Number(amt) <= 0) { toast.error('Enter the amount'); return; }
    if (!requestedDue) { toast.error('Pick a new due date'); return; }
    setBusy(true);
    try {
      await requestExtension({
        kind,
        unitId,
        amount: Number(amt),
        originalDue: originalDue || new Date().toISOString(),
        requestedDue,
        reason: reason.trim(),
        approverId,
      });
      toast.success('Request sent. You will be notified once it is decided.');
      onSent?.();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not send request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md" variant="bottom" title="Request more time">
      <div className="space-y-3 pb-2">
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-300">
          <Clock size={16} className="mt-0.5 shrink-0" />
          <p>Money's not always there on time. Send a request to {approverName || 'your landlord'} — they decide and you get notified. Good standing protects your score.</p>
        </div>

        <Input
          label="Amount (KES)"
          type="number"
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
          placeholder="45000"
        />

        <Input
          label="New due date"
          type="date"
          value={requestedDue}
          onChange={(e) => setRequestedDue(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
        />

        <div className="w-full space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Salary delayed by 5 days — will pay in full on the 10th."
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
          />
          <p className="text-[11px] text-gray-400">Be honest. Specific reasons get approved faster.</p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSubmit} disabled={busy}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Send request
          </Button>
        </div>
      </div>
    </Modal>
  );
}
