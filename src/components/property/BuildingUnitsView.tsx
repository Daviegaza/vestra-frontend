import { useState } from 'react';
import { Users, Phone, Megaphone, CreditCard, Search, Building } from 'lucide-react';
import Card, { Badge } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { toast } from '../../store/toastStore';
import { useRentalStore } from '../../store/rentalStore';

const statusConfig = {
  occupied: { label: 'Occupied', color: 'success' as const },
  vacant: { label: 'Vacant', color: 'warning' as const },
  maintenance: { label: 'Maintenance', color: 'danger' as const },
};

const paymentConfig = {
  paid: { label: 'Paid', color: 'text-emerald-400 bg-emerald-900/20', dot: 'bg-emerald-500' },
  pending: { label: 'Pending', color: 'text-amber-400 bg-amber-900/20', dot: 'bg-amber-500' },
  overdue: { label: 'Overdue', color: 'text-red-400 bg-red-900/20', dot: 'bg-red-500' },
};

export default function BuildingUnitsView() {
  const { buildingRooms, occupyRoom, vacateRoom, markRoomPaid, addRoom } = useRentalStore();
  const [selectedBuilding, setSelectedBuilding] = useState<string>('bld-001');
  const [searchUnit, setSearchUnit] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showOccupy, setShowOccupy] = useState(false);
  const [newRoom, setNewRoom] = useState({ number: '', floor: '1', bedrooms: '1', bathrooms: '1', rentAmount: '' });
  const [occupyForm, setOccupyForm] = useState({ tenantName: '', tenantPhone: '' });

  const buildings = [...new Set(buildingRooms.map((r) => r.buildingId))].map((bid) => {
    const rooms = buildingRooms.filter((r) => r.buildingId === bid);
    return { id: bid, name: rooms[0]?.buildingName || 'Building', rooms };
  });

  const currentBuilding = buildings.find((b) => b.id === selectedBuilding);
  const allRooms = currentBuilding?.rooms || [];
  const filtered = allRooms.filter((r) => {
    if (filterStatus === 'paid') return r.paymentStatus === 'paid';
    if (filterStatus === 'overdue') return r.paymentStatus === 'overdue';
    if (filterStatus === 'pending') return r.paymentStatus === 'pending';
    if (filterStatus === 'vacant') return r.status === 'vacant';
    if (filterStatus === 'occupied') return r.status === 'occupied';
    if (searchUnit) return r.number.toLowerCase().includes(searchUnit.toLowerCase()) || r.tenantName?.toLowerCase().includes(searchUnit.toLowerCase());
    return true;
  });

  const stats = {
    total: allRooms.length,
    occupied: allRooms.filter((r) => r.status === 'occupied').length,
    vacant: allRooms.filter((r) => r.status === 'vacant').length,
    paid: allRooms.filter((r) => r.paymentStatus === 'paid').length,
    overdue: allRooms.filter((r) => r.paymentStatus === 'overdue').length,
  };

  if (!currentBuilding) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">My Properties</h1><p className="text-gray-400 mt-1">{buildings.length} buildings · {buildingRooms.length} total units</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {buildings.map((b) => {
            const occ = b.rooms.filter((r) => r.status === 'occupied').length;
            const ovd = b.rooms.filter((r) => r.paymentStatus === 'overdue').length;
            return (
              <button key={b.id} onClick={() => setSelectedBuilding(b.id)} className="text-left">
                <Card className="p-5 space-y-3 hover:border-emerald-600 transition-all">
                  <h3 className="font-semibold text-white text-lg">{b.name}</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-gray-800/50"><p className="text-lg font-bold text-white">{b.rooms.length}</p><p className="text-[10px] text-gray-400">Total</p></div>
                    <div className="p-2 rounded bg-emerald-900/20"><p className="text-lg font-bold text-emerald-400">{occ}</p><p className="text-[10px] text-gray-400">Occupied</p></div>
                    <div className="p-2 rounded bg-red-900/20"><p className="text-lg font-bold text-red-400">{ovd}</p><p className="text-[10px] text-gray-400">Overdue</p></div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">View Units</Button>
                </Card>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const handleAdvertise = (room: typeof allRooms[0]) => {
    toast.success(`Room ${room.number} advertised on market! KES ${room.rentAmount.toLocaleString()}/mo`);
  };

  const handleOccupy = () => {
    if (!selectedRoom || !occupyForm.tenantName || !occupyForm.tenantPhone) {
      toast.error('Fill tenant name and phone.');
      return;
    }
    occupyRoom(selectedRoom, occupyForm.tenantName, occupyForm.tenantPhone);
    setShowOccupy(false);
    setOccupyForm({ tenantName: '', tenantPhone: '' });
    setSelectedRoom(null);
  };

  const handleAddRoom = () => {
    if (!newRoom.number || !newRoom.rentAmount) { toast.error('Fill room number and rent amount.'); return; }
    addRoom({ buildingId: selectedBuilding, buildingName: currentBuilding.name, number: newRoom.number, floor: Number(newRoom.floor), bedrooms: Number(newRoom.bedrooms), bathrooms: Number(newRoom.bathrooms), rentAmount: Number(newRoom.rentAmount) });
    setShowAddRoom(false);
    setNewRoom({ number: '', floor: '1', bedrooms: '1', bathrooms: '1', rentAmount: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => setSelectedBuilding('')} className="text-sm text-gray-400 hover:text-emerald-400 mb-1 flex items-center gap-1">← All Properties</button>
          <h1 className="text-2xl font-bold text-white">{currentBuilding.name}</h1>
          <p className="text-gray-400 text-sm">{stats.total} units · {stats.occupied} occupied · {stats.vacant} vacant · {stats.overdue} overdue</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('Building listed on market!')}><Megaphone size={14} /> Advertise</Button>
          <Button size="sm" onClick={() => setShowAddRoom(true)}>+ Add Room</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[{ label: 'Total', value: stats.total, color: 'text-white' }, { label: 'Occupied', value: stats.occupied, color: 'text-emerald-400' }, { label: 'Vacant', value: stats.vacant, color: 'text-amber-400' }, { label: 'Paid', value: stats.paid, color: 'text-emerald-400' }, { label: 'Overdue', value: stats.overdue, color: 'text-red-400' }].map((s) => (
          <Card key={s.label} className="p-3 text-center"><p className={`text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-[10px] text-gray-400">{s.label}</p></Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search room number or tenant..." value={searchUnit} onChange={(e) => setSearchUnit(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', 'occupied', 'vacant', 'paid', 'overdue', 'pending'].map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filterStatus === f ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((room) => {
          const payment = paymentConfig[room.paymentStatus];
          return (
            <Card key={room.id} className={`p-4 space-y-3 hover:border-emerald-600 transition-all ${room.paymentStatus === 'overdue' ? 'border-red-700/50 ring-1 ring-red-900/30' : room.status === 'vacant' ? 'border-amber-700/30 border-dashed' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${room.status === 'occupied' ? 'bg-emerald-900/30 text-emerald-400' : room.status === 'vacant' ? 'bg-amber-900/20 text-amber-400 border border-dashed border-amber-700/50' : 'bg-red-900/30 text-red-400'}`}>
                    {room.number}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Room {room.number}</p>
                    <p className="text-[10px] text-gray-400">Flr {room.floor} · {room.bedrooms}bd · {room.bathrooms}ba</p>
                  </div>
                </div>
                <Badge variant={statusConfig[room.status].color}>{statusConfig[room.status].label}</Badge>
              </div>

              {room.status === 'occupied' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Users size={14} className="text-gray-400" /><span className="text-white">{room.tenantName}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-gray-400" /><span className="text-gray-300 text-xs">{room.tenantPhone}</span></div>
                  <div className={`flex items-center justify-between p-2 rounded-lg ${payment.color}`}>
                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${payment.dot}`} /><span className="text-xs font-medium">{payment.label}</span></div>
                    <span className="text-xs font-bold">KES {room.rentAmount.toLocaleString()}</span>
                  </div>
                  {room.lastPaymentDate && <p className="text-[10px] text-gray-500">Last: {new Date(room.lastPaymentDate).toLocaleDateString()}</p>}
                  <div className="flex gap-1 pt-1">
                    {room.paymentStatus !== 'paid' && <Button size="sm" className="text-xs flex-1 py-1" onClick={() => markRoomPaid(room.id)}><CreditCard size={12} /> Mark Paid</Button>}
                    <Button size="sm" variant="ghost" className="text-xs py-1" onClick={() => vacateRoom(room.id)}>Vacate</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">KES {room.rentAmount.toLocaleString()}/mo</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs py-1" onClick={() => { setSelectedRoom(room.id); setShowOccupy(true); }}><Users size={12} /> Occupy</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs py-1" onClick={() => handleAdvertise(room)}><Megaphone size={12} /> Advertise</Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-400">
            <Building size={48} className="mx-auto mb-3 text-gray-600" />
            <p>No rooms match your filters.</p>
          </div>
        )}
      </div>

      <Modal open={showAddRoom} onClose={() => setShowAddRoom(false)} title="Add New Room">
        <div className="space-y-4">
          <Input label="Room Number *" value={newRoom.number} onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })} placeholder="e.g., 106" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Floor" type="number" value={newRoom.floor} onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })} />
            <Input label="Bedrooms" type="number" value={newRoom.bedrooms} onChange={(e) => setNewRoom({ ...newRoom, bedrooms: e.target.value })} />
            <Input label="Bathrooms" type="number" value={newRoom.bathrooms} onChange={(e) => setNewRoom({ ...newRoom, bathrooms: e.target.value })} />
            <Input label="Rent (KES) *" type="number" value={newRoom.rentAmount} onChange={(e) => setNewRoom({ ...newRoom, rentAmount: e.target.value })} />
          </div>
          <div className="flex gap-2"><Button variant="outline" onClick={() => setShowAddRoom(false)} className="flex-1">Cancel</Button><Button onClick={handleAddRoom} className="flex-1">Add Room</Button></div>
        </div>
      </Modal>

      <Modal open={showOccupy} onClose={() => setShowOccupy(false)} title="Occupy Room">
        <div className="space-y-4">
          <Input label="Tenant Name *" value={occupyForm.tenantName} onChange={(e) => setOccupyForm({ ...occupyForm, tenantName: e.target.value })} />
          <Input label="Tenant Phone *" value={occupyForm.tenantPhone} onChange={(e) => setOccupyForm({ ...occupyForm, tenantPhone: e.target.value })} placeholder="+254 7XX XXX XXX" />
          <div className="flex gap-2"><Button variant="outline" onClick={() => setShowOccupy(false)} className="flex-1">Cancel</Button><Button onClick={handleOccupy} className="flex-1">Occupy Room</Button></div>
        </div>
      </Modal>
    </div>
  );
}
