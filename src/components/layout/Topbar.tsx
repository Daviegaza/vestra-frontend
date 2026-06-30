import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useRealtimeStore } from '../../store/realtimeStore';
import {
  Menu, Bell, Sun, Moon, Globe, Search, Settings,
  LogOut, User, MessageSquare, LayoutDashboard, Building,
  Heart, DollarSign, ChevronDown, Sparkles, Layers, Plus,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../ui/Breadcrumb';
import CommandPalette from '../ui/CommandPalette';
import NotificationCenter from '../ui/NotificationCenter';
import Avatar from '../ui/Avatar';
import Dropdown from '../ui/Dropdown';
import type { DropdownItem } from '../ui/Dropdown';
import { ROLE_INDEX, roleAccentClasses } from '../../lib/roleCatalog';
import type { UserRole } from '../../types';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { isAuthenticated, user, logout, switchRole } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const { unreadCount } = useRealtimeStore();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'sw'>(() => (localStorage.getItem('vestra_lang') as 'en' | 'sw') || 'en');
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const activeRole: UserRole = user?.activeRole || 'buyer';
  const roleEntry = ROLE_INDEX[activeRole];
  const roleAccent = roleEntry ? roleAccentClasses(roleEntry.accent) : roleAccentClasses('emerald');
  const otherRoles = (user?.roles || []).filter((r) => r !== activeRole);

  const handleRoleSwitch = (r: UserRole) => {
    switchRole(r);
    setRoleMenuOpen(false);
    navigate(ROLE_INDEX[r]?.dashboardPath || '/dashboard');
  };

  useEffect(() => { localStorage.setItem('vestra_lang', lang); }, [lang]);

  const t = (en: string, sw: string) => lang === 'sw' ? sw : en;

  const userDropdownItems: DropdownItem[] = [
    { id: 'profile', label: t('My Profile', 'Wasifu Wangu'), icon: <User size={15} />, onClick: () => {} },
    { id: 'dashboard', label: t('Dashboard', 'Dashibodi'), icon: <LayoutDashboard size={15} />, href: '/dashboard' },
    { id: 'market', label: t('Browse Properties', 'Vinjari Mali'), icon: <Building size={15} />, href: '/market' },
    { id: 'sell', label: t('Sell Property', 'Uza Mali'), icon: <DollarSign size={15} />, href: '/sell' },
    { id: 'saved', label: t('Saved', 'Zilizohifadhiwa'), icon: <Heart size={15} />, href: '/settings' },
    { id: 'messages', label: t('Messages', 'Jumbe'), icon: <MessageSquare size={15} />, href: '/messages' },
    { id: 'settings', label: t('Settings', 'Mipangilio'), icon: <Settings size={15} />, href: '/settings' },
    { id: 'divider', label: '', divider: true },
    { id: 'logout', label: t('Sign Out', 'Ondoka'), icon: <LogOut size={15} />, danger: true, onClick: logout },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-16 glass-premium border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-4 lg:px-6 shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          )}
          {/* Logo — visible when sidebar is collapsed or on mobile */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Building size={14} className="text-white" />
            </div>
            <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">Vestra</span>
          </Link>
          <div className="hidden md:block ml-2">
            <Breadcrumb />
          </div>
        </div>

        {/* Center */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true } as KeyboardEventInit);
              document.dispatchEvent(event);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <Search size={14} />
            <span className="flex-1 text-left">Search pages and actions...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors uppercase"
          >
            <Globe size={16} />
            <span className="hidden sm:inline">{lang}</span>
          </button>

          {isAuthenticated ? (
            <>
              {/* Role switcher chip */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${roleAccent.bg} ${roleAccent.text} hover:ring-2 ${roleAccent.ring} transition-all`}
                  aria-label="Switch role"
                >
                  <Layers size={12} />
                  <span className="hidden md:inline">{roleEntry?.label || activeRole}</span>
                  <ChevronDown size={12} className="opacity-60" />
                </button>
                {roleMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setRoleMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-40 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5">
                      <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Switch role</p>
                      {otherRoles.length === 0 && (
                        <p className="px-3 py-2 text-xs text-gray-500">You only have one role. Add another below.</p>
                      )}
                      {otherRoles.map((r) => {
                        const entry = ROLE_INDEX[r];
                        const Icon = entry?.icon;
                        const a = entry ? roleAccentClasses(entry.accent) : roleAccent;
                        return (
                          <button
                            key={r}
                            onClick={() => handleRoleSwitch(r)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${a.bg}`}>
                              {Icon && <Icon size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{entry?.label || r}</p>
                              <p className="text-[10px] text-gray-500 truncate">{entry?.tagline || ''}</p>
                            </div>
                          </button>
                        );
                      })}
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                        <button
                          onClick={() => { setRoleMenuOpen(false); navigate('/dashboard/roles'); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          <Plus size={14} /> Manage roles
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Notifications */}
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Messages */}
              <Link
                to="/messages"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:block"
                aria-label="Messages"
              >
                <MessageSquare size={18} />
              </Link>

              {/* AI Assistant trigger */}
              <button
                onClick={() => {
                  const aiBtn = document.querySelector('[class*="fixed bottom-6 right-6"]') as HTMLElement;
                  aiBtn?.click();
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:block"
                aria-label="AI Assistant"
              >
                <Sparkles size={18} />
              </button>

              {/* User Dropdown */}
              <Dropdown
                items={userDropdownItems}
                align="right"
                trigger={
                  <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <Avatar name={user?.fullName} size="sm" />
                    <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                      {user?.fullName}
                    </span>
                    <ChevronDown size={14} className="hidden lg:block text-gray-400" />
                  </div>
                }
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('Sign In', 'Ingia')}
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                {t('Get Started', 'Anza')}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Command Palette */}
      <CommandPalette />
    </>
  );
}
