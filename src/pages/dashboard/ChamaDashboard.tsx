import { useState } from 'react';
import { Users, TrendingUp, CreditCard, Vote, PlusCircle, CheckCircle, UserPlus, Calendar } from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import Card, { Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from '../../store/toastStore';

interface ChamaMember {
  id: string; name: string; contribution: number; share: number; joinedAt: string; avatar: string;
}

interface ChamaProposal {
  id: string; title: string; description: string;
  votes: { yes: number; no: number; abstain: number };
  status: 'active' | 'passed' | 'rejected'; deadline: string;
}

const initialMembers: ChamaMember[] = [
  { id: 'cm-1', name: 'John Doe', contribution: 500000, share: 16.7, joinedAt: '2026-01-15', avatar: '' },
  { id: 'cm-2', name: 'Mary Wanjiku', contribution: 500000, share: 16.7, joinedAt: '2026-01-15', avatar: '' },
  { id: 'cm-3', name: 'Peter Kamau', contribution: 500000, share: 16.7, joinedAt: '2026-02-01', avatar: '' },
  { id: 'cm-4', name: 'Jane Muthoni', contribution: 500000, share: 16.7, joinedAt: '2026-02-01', avatar: '' },
  { id: 'cm-5', name: 'David Ochieng', contribution: 500000, share: 16.7, joinedAt: '2026-03-01', avatar: '' },
  { id: 'cm-6', name: 'Sarah Wambui', contribution: 500000, share: 16.7, joinedAt: '2026-03-15', avatar: '' },
];

export default function ChamaDashboard() {
  const [showInvite, setShowInvite] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [proposals, setProposals] = useState<ChamaProposal[]>([
    { id: 'prp-1', title: 'Invest in Diani Beachfront Plot', description: 'Purchase 0.5 acre beachfront plot in Diani for KES 15M. Expected appreciation 20% in 2 years.', votes: { yes: 4, no: 1, abstain: 1 }, status: 'active', deadline: '2026-07-01' },
    { id: 'prp-2', title: 'Monthly Contribution Increase', description: 'Increase monthly contribution from KES 25K to KES 35K to accelerate property acquisition.', votes: { yes: 3, no: 3, abstain: 0 }, status: 'active', deadline: '2026-06-30' },
  ]);

  const handleVote = (proposalId: string, vote: 'yes' | 'no') => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? { ...p, votes: { ...p.votes, [vote]: p.votes[vote] + 1 } }
          : p,
      ),
    );
    toast.success(`Vote recorded: ${vote.toUpperCase()}`);
  };

  const handleInvite = () => {
    setShowInvite(false);
    toast.success('Invite sent via SMS and WhatsApp!');
  };

  const handleNewProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const title = (form.elements.namedItem('propTitle') as HTMLInputElement).value;
    const desc = (form.elements.namedItem('propDesc') as HTMLTextAreaElement).value;
    if (!title || !desc) { toast.error('Please fill all fields.'); return; }
    const newProposal: ChamaProposal = {
      id: `prp-${Date.now()}`,
      title,
      description: desc,
      votes: { yes: 0, no: 0, abstain: 0 },
      status: 'active',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setProposals((prev) => [newProposal, ...prev]);
    setShowProposal(false);
    toast.success('New proposal created!');
  };

  const totalCapital = initialMembers.reduce((s, m) => s + m.contribution, 0);

  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chama Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Vestra Investment Group &middot; {initialMembers.length} Members</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowInvite(true)}><UserPlus size={16} /> Invite Member</Button>
            <Button onClick={() => setShowProposal(true)}><PlusCircle size={16} /> New Proposal</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Capital" value={`KES ${(totalCapital / 1_000_000).toFixed(1)}M`} icon={CreditCard} color="emerald" />
          <StatCard title="Members" value={initialMembers.length} icon={Users} color="blue" />
          <StatCard title="Active Proposals" value={proposals.filter((p) => p.status === 'active').length} icon={Vote} color="amber" />
          <StatCard title="Monthly Contribution" value="KES 150K" icon={TrendingUp} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Members</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {initialMembers.map((m) => (
                <div key={m.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-sm font-bold text-emerald-600">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{m.name}</p>
                      <p className="text-xs text-gray-500">Joined {new Date(m.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">KES {m.contribution.toLocaleString('en-KE')}</p>
                    <p className="text-xs text-gray-500">{m.share}% share</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Proposals</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {proposals.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">{p.title}</h4>
                    <Badge variant={p.status === 'active' ? 'warning' : p.status === 'passed' ? 'success' : 'danger'}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{p.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-emerald-600">{p.votes.yes} Yes</span>
                    <span className="text-red-600">{p.votes.no} No</span>
                    <span className="text-gray-400">{p.votes.abstain} Abstain</span>
                    <span className="text-gray-400 flex items-center gap-1"><Calendar size={10} /> Ends {new Date(p.deadline).toLocaleDateString()}</span>
                  </div>
                  {p.status === 'active' && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleVote(p.id, 'yes')}>Vote Yes</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleVote(p.id, 'no')}>Vote No</Button>
                    </div>
                  )}
                </div>
              ))}
              {proposals.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <Vote size={32} className="mx-auto mb-2 text-gray-600" />
                  <p>No proposals yet.</p>
                  <Button size="sm" className="mt-3" onClick={() => setShowProposal(true)}>Create one</Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {showInvite && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Invite Member</h3>
            <Input label="Phone Number" placeholder="+254 7XX XXX XXX" />
            <Input label="Name" placeholder="Full name" />
            <p className="text-xs text-gray-500">They will receive an SMS and WhatsApp invite to join the chama.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button onClick={handleInvite}><CheckCircle size={16} /> Send Invite</Button>
            </div>
          </Card>
        )}

        {showProposal && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">New Proposal</h3>
            <form onSubmit={handleNewProposal} className="space-y-4">
              <Input label="Title" name="propTitle" placeholder="e.g., Invest in a plot" />
              <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label><textarea name="propDesc" rows={3} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowProposal(false)}>Cancel</Button>
                <Button type="submit"><CheckCircle size={16} /> Create Proposal</Button>
              </div>
            </form>
          </Card>
        )}
      </div>
  );
}
