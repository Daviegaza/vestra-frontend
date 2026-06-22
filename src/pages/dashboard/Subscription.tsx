import { Check, Star } from 'lucide-react';
import { useState } from 'react';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import MPesaPayment from '../../components/payment/MPesaPayment';
import { useSubscriptionStore, tierPrices, tierFeatures, type SubscriptionTier } from '../../store/subscriptionStore';
import { toast } from '../../store/toastStore';

const tiers: { key: SubscriptionTier; name: string; color: string }[] = [
  { key: 'free', name: 'Free', color: 'text-gray-400' },
  { key: 'basic', name: 'Basic', color: 'text-blue-400' },
  { key: 'pro', name: 'Pro', color: 'text-emerald-400' },
  { key: 'premium', name: 'Premium', color: 'text-amber-400' },
];

const features = [
  { label: 'Property Listings', key: 'listings' as const },
  { label: 'Featured Listings', key: 'featured' as const },
  { label: 'Verification Reports', key: 'verification' as const },
  { label: 'Analytics', key: 'analytics' as const },
  { label: 'Lead Management', key: 'leads' as const },
  { label: 'Directory Placement', key: 'placement' as const },
  { label: 'Commission Rate', key: 'commission' as const },
];

export default function Subscription() {
  const { tier, upgrade } = useSubscriptionStore();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    setSelectedTier(tier);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedTier) {
      upgrade(selectedTier);
      toast.success(`Upgraded to ${selectedTier} tier!`);
    }
    setShowPayment(false);
    setSelectedTier(null);
  };

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Current plan: <span className="font-semibold text-emerald-400 capitalize">{tier}</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => {
            const isCurrent = tier === t.key;
            const f = tierFeatures[t.key];
            return (
              <Card key={t.key} className={`p-6 space-y-4 ${isCurrent ? 'ring-2 ring-emerald-500' : ''}`}>
                <div className="text-center space-y-2">
                  <h3 className={`font-bold text-lg ${t.color}`}>{t.name}</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    KES {tierPrices[t.key].toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
                <div className="space-y-2 text-sm">
                  {features.map((feat) => (
                    <div key={feat.key} className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{feat.label}:</span>
                      <span className="font-medium text-gray-900 dark:text-white ml-auto text-right">
                        {String(f[feat.key])}
                      </span>
                    </div>
                  ))}
                </div>
                {isCurrent ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button onClick={() => handleUpgrade(t.key)} className="w-full" variant={t.key === 'premium' ? 'primary' : 'outline'}>
                    {t.key === 'premium' && <Star size={14} className="mr-1" />}
                    Upgrade to {t.name}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 font-medium text-gray-500">Feature</th>
                  {tiers.map((t) => (
                    <th key={t.key} className={`text-center py-2 font-medium ${t.color}`}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feat) => (
                  <tr key={feat.key} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 text-gray-700 dark:text-gray-300">{feat.label}</td>
                    {tiers.map((t) => (
                      <td key={t.key} className="text-center py-3 text-gray-900 dark:text-white font-medium">
                        {String(tierFeatures[t.key][feat.key])}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Price</td>
                  {tiers.map((t) => (
                    <td key={t.key} className="text-center py-3 text-gray-900 dark:text-white font-bold">
                      KES {tierPrices[t.key].toLocaleString()}/mo
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal open={showPayment} onClose={() => setShowPayment(false)} title={`Upgrade to ${selectedTier || ''}`}>
        {selectedTier && (
          <MPesaPayment
            amount={tierPrices[selectedTier]}
            description={`${selectedTier} subscription — Monthly`}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        )}
      </Modal>
    </DashboardShell>
  );
}
