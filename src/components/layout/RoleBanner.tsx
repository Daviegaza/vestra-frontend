import { useAuthStore } from '../../store/authStore';
import { getRoleTheme } from '../../lib/roleThemes';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const roleSubtitles: Record<string, string> = {
  buyer: 'Find your perfect property with AI-powered search and verification.',
  seller: 'List your property and reach thousands of verified buyers.',
  landlord: 'Manage your rental portfolio with ease and transparency.',
  tenant: 'Pay rent, submit maintenance requests, and find your next home.',
  agent: 'Grow your business with leads, listings, and commission tracking.',
  admin: 'Monitor platform activity, manage users, and ensure trust.',
};

export default function RoleBanner() {
  const { user } = useAuthStore();
  const activeRole = user?.activeRole || 'buyer';
  const theme = getRoleTheme(activeRole);
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${theme.gradient} p-6 sm:p-8 mb-8`}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{theme.emoji}</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {getGreeting()}, {firstName}
            </h1>
          </div>
          <p className="text-sm text-gray-300 max-w-md">
            {roleSubtitles[activeRole]}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${theme.badge}`}>
          {activeRole}
        </span>
      </div>
    </div>
  );
}
