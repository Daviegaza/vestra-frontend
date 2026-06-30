import { useEffect, useState } from 'react';
import { UserPlus, Send, Clock, CheckCircle2, XCircle, Building } from 'lucide-react';
import Card, { Badge } from '../ui/Card';
import Button from '../ui/Button';
import InviteTenantModal from './InviteTenantModal';
import { apiRequest } from '../../services/api';
import { getLandlordInvites, type TenantInvite } from '../../services/invites';

interface BackendUnit {
  id: string;
  title: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  rentAmount: number | string;
  status: 'vacant' | 'occupied' | 'maintenance';
}

export default function LandlordInvitesPanel() {
  const [units, setUnits] = useState<BackendUnit[]>([]);
  const [invites, setInvites] = useState<TenantInvite[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BackendUnit | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [u, i] = await Promise.all([
        apiRequest<{ units: BackendUnit[] }>('/api/rentals/units').then((r) => r.units),
        getLandlordInvites(),
      ]);
      setUnits(u);
      setInvites(i);
    } catch { /* swallow */ }
    finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  const openModal = (unit: BackendUnit) => {
    setSelectedUnit(unit);
    setModalOpen(true);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserPlus size={18} className="text-violet-600" /> Tenant invitations
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Invite tenants by email or phone. They get the tenant role automatically when they accept.</p>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your units</p>
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : units.length === 0 ? (
          <p className="text-sm text-gray-500">No units yet. Add a unit first (above) before inviting tenants.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {units.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 flex items-center justify-center shrink-0">
                    <Building size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.title}</p>
                    <p className="text-[11px] text-gray-500 truncate">{u.city} · {u.bedrooms}BR · KES {Math.round(Number(u.rentAmount)).toLocaleString()}/mo</p>
                  </div>
                </div>
                <Button size="sm" variant={u.status === 'occupied' ? 'outline' : 'primary'} onClick={() => openModal(u)} disabled={u.status === 'occupied'}>
                  <Send size={12} /> {u.status === 'occupied' ? 'Occupied' : 'Invite'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent invitations</p>
        {invites.length === 0 ? (
          <p className="text-sm text-gray-500">No invitations sent yet.</p>
        ) : (
          <div className="space-y-2">
            {invites.map((inv) => {
              const statusUI = inv.status === 'accepted'
                ? { icon: CheckCircle2, color: 'success' as const, text: 'Accepted' }
                : inv.status === 'declined'
                ? { icon: XCircle, color: 'danger' as const, text: 'Declined' }
                : { icon: Clock, color: 'warning' as const, text: 'Pending' };
              const Icon = statusUI.icon;
              return (
                <div key={inv.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-2.5 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {inv.tenantUser?.fullName || inv.tenantEmail || inv.tenantPhone}
                      <span className="text-gray-400 font-normal"> · {inv.unit?.title}</span>
                    </p>
                    <p className="text-[11px] text-gray-500">{new Date(inv.createdAt).toLocaleString()}</p>
                  </div>
                  <Badge variant={statusUI.color} dot>
                    <Icon size={12} /> {statusUI.text}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <InviteTenantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        unitId={selectedUnit?.id}
        unitTitle={selectedUnit?.title}
        defaultRent={selectedUnit ? Number(selectedUnit.rentAmount) : undefined}
        onSent={refresh}
      />
    </Card>
  );
}
