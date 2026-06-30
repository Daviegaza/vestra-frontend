import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import { roleAccentClasses, type RoleCatalogEntry } from '../../lib/roleCatalog';

interface Props {
  entry: RoleCatalogEntry | null;
  open: boolean;
  onClose: () => void;
}

type Step = 'intro' | 'form' | 'success';

export default function RoleActivationModal({ entry, open, onClose }: Props) {
  const navigate = useNavigate();
  const activateRole = useAuthStore((s) => s.activateRole);
  const [step, setStep] = useState<Step>('intro');
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!entry) return null;
  const accent = roleAccentClasses(entry.accent);
  const Icon = entry.icon;

  const reset = () => { setStep('intro'); setValues({}); setErrors({}); };
  const handleClose = () => { reset(); onClose(); };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    for (const field of entry.activationFields) {
      if (field.required && !values[field.name]?.toString().trim()) {
        errs[field.name] = `${field.label} is required`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await activateRole(entry.role, values);
      setStep('success');
      toast.success(`${entry.label} role activated — welcome aboard!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Activation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    handleClose();
    navigate(entry.dashboardPath);
  };

  return (
    <Modal open={open} onClose={handleClose} size="md" variant="bottom">
      <div className="space-y-5 pb-2">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent.bg}`}>
            <Icon size={22} className={accent.text} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {step === 'success' ? `You're now a ${entry.label}` : `Activate ${entry.label}`}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{entry.tagline}</p>
          </div>
        </div>

        {step === 'intro' && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{entry.description}</p>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className={accent.text} /> What you get
              </p>
              <ul className="space-y-1.5">
                {entry.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${accent.text}`} />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            {entry.requiresReview && (
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-3 text-xs text-amber-700 dark:text-amber-300">
                <Shield size={14} className="mt-0.5 shrink-0" />
                <span>This role needs license verification. You can use it immediately — full features unlock after review (1–2 days).</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={handleClose}>Maybe later</Button>
              <Button className={accent.solid + ' text-white'} onClick={() => setStep('form')}>
                Continue <ArrowRight size={14} />
              </Button>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">Just a few details to set up your {entry.label.toLowerCase()} workspace.</p>
            <div className="space-y-3">
              {entry.activationFields.map((field) => (
                <div key={field.name}>
                  {field.type === 'select' ? (
                    <div className="w-full space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <select
                        value={values[field.name] || ''}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="" disabled>Choose…</option>
                        {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      {errors[field.name] && <p className="text-xs text-red-500">{errors[field.name]}</p>}
                      {field.help && !errors[field.name] && <p className="text-xs text-gray-400">{field.help}</p>}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <div className="w-full space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <textarea
                        value={values[field.name] || ''}
                        placeholder={field.placeholder}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                      />
                      {errors[field.name] && <p className="text-xs text-red-500">{errors[field.name]}</p>}
                      {field.help && !errors[field.name] && <p className="text-xs text-gray-400">{field.help}</p>}
                    </div>
                  ) : (
                    <Input
                      label={field.required ? `${field.label} *` : field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={values[field.name] || ''}
                      onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                      error={errors[field.name]}
                      hint={field.help}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStep('intro')}>Back</Button>
              <Button className={accent.solid + ' text-white'} onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Activating…</> : <>Activate {entry.label} <CheckCircle2 size={14} /></>}
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-900/40 p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{entry.label} workspace ready</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your new dashboard is set up. You can switch back to your member view anytime.</p>
            </div>
            <Button className={accent.solid + ' text-white w-full'} size="lg" onClick={handleGoToDashboard}>
              Open {entry.label} Dashboard <ArrowRight size={16} />
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
