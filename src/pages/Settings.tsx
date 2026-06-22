import { User, Lock, Bell, Save } from 'lucide-react';
import { useState } from 'react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';

export default function Settings() {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSaveProfile = () => {
    if (!fullName.trim()) { toast.error('Name is required'); return; }
    const updated = { ...user!, fullName, phone, location };
    useAuthStore.setState({ user: updated });
    localStorage.setItem('vestra_user', JSON.stringify(updated));
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!currentPass || !newPass) { toast.error('Please fill all password fields'); return; }
    if (newPass.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords do not match'); return; }
    toast.success('Password updated successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences.</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <User size={20} className="text-emerald-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Profile</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" defaultValue={user?.email} disabled />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile}><Save size={16} /> Save Changes</Button>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <Bell size={20} className="text-emerald-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            {['Email notifications', 'SMS alerts', 'Push notifications', 'Marketing emails'].map((label) => (
              <label key={label} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <Lock size={20} className="text-emerald-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Security</h2>
          </div>
          <div className="space-y-4">
            <Input label="Current Password" type="password" placeholder="Enter current password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
            <Input label="New Password" type="password" placeholder="Enter new password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <Input label="Confirm New Password" type="password" placeholder="Confirm new password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
            <Button onClick={handleChangePassword}><Save size={16} /> Update Password</Button>
          </div>
        </Card>
      </div>

  );
}
