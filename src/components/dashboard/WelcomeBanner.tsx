import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import { CalendarDays } from 'lucide-react';

export default function WelcomeBanner() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-kikuyu-700 p-6 lg:p-8 text-white">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user?.fullName} size="lg" className="ring-4 ring-white/20" />
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">
              {getGreeting()}, {user?.fullName?.split(' ')[0]}!
            </h2>
            <div className="flex items-center gap-2 mt-1 text-emerald-100 text-sm">
              <CalendarDays size={14} />
              <span>{today}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium border border-white/10">
            {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)} Account
          </span>
        </div>
      </div>
    </div>
  );
}
