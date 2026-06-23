import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building, Shield, Users, Info, Menu, X, Bell, LogOut,
  User, Settings, MessageSquare, LayoutDashboard, Search,
  Home, Sparkles, Sun, Moon, Globe, DollarSign, Heart,
  ChevronDown, MapPin,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useRealtimeStore } from '../../store/realtimeStore';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import NotificationCenter from '../ui/NotificationCenter';

const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Kilifi', 'Machakos', 'Nyeri'];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const { unreadCount } = useRealtimeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'sw'>(() => (localStorage.getItem('vestra_lang') as 'en' | 'sw') || 'en');
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  useEffect(() => { localStorage.setItem('vestra_lang', lang); }, [lang]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const t = (en: string, sw: string) => lang === 'sw' ? sw : en;

  const role = user?.role;
  const navLinks = role === 'seller' || role === 'agent'
    ? [
        { to: '/market', label: t('Properties', 'Mali'), icon: Building },
        { to: role === 'seller' ? '/dashboard/seller/listings' : '/dashboard/agent/listings', label: t('My Listings', 'Orodha Yangu'), icon: Home },
        { to: '/verify', label: t('Verify', 'Hakiki'), icon: Shield },
        { to: '/agents', label: t('Agents', 'Mawakala'), icon: Users },
      ]
    : role === 'landlord'
    ? [
        { to: '/market', label: t('Properties', 'Mali'), icon: Building },
        { to: '/dashboard/landlord/units', label: t('My Units', 'Nyumba Zangu'), icon: Home },
        { to: '/verify', label: t('Verify', 'Hakiki'), icon: Shield },
        { to: '/agents', label: t('Agents', 'Mawakala'), icon: Users },
      ]
    : role === 'tenant'
    ? [
        { to: '/market', label: t('Properties', 'Mali'), icon: Building },
        { to: '/dashboard/tenant/rent', label: t('Pay Rent', 'Lipa Kodi'), icon: DollarSign },
        { to: '/dashboard/tenant/maintenance', label: t('Maintenance', 'Matengenezo'), icon: Shield },
        { to: '/agents', label: t('Agents', 'Mawakala'), icon: Users },
      ]
    : role === 'admin'
    ? [
        { to: '/dashboard/admin', label: t('Admin', 'Msimamizi'), icon: Shield },
        { to: '/dashboard/admin/users', label: t('Users', 'Watumiaji'), icon: Users },
        { to: '/dashboard/admin/properties', label: t('Properties', 'Mali'), icon: Building },
      ]
    : [
        { to: '/market', label: t('Properties', 'Mali'), icon: Building },
        { to: '/agents', label: t('Agents', 'Mawakala'), icon: Users },
        { to: '/about', label: t('About', 'Kuhusu'), icon: Info },
      ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-premium shadow-sm'
            : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-transparent'
        } ${!scrolled ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building size={16} className="text-white" />
              </div>
              <span className="text-emerald-600 dark:text-emerald-400">Vestra</span>
              <span className="hidden sm:inline text-[10px] bg-savannah-100 dark:bg-savannah-900/30 text-savannah-700 dark:text-savannah-400 px-1.5 py-0.5 rounded font-semibold uppercase">
                KE
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {/* Properties Mega Menu Trigger */}
              <div className="relative group">
                <Link
                  to="/market"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                    isActive('/market')
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Building size={16} />
                  {t('Properties', 'Mali')}
                  <ChevronDown size={12} className="opacity-50" />
                </Link>
                {/* County dropdown on hover */}
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <MapPin size={12} className="inline mr-1" />Popular Counties
                  </div>
                  {counties.map((c) => (
                    <Link
                      key={c}
                      to={`/market?county=${c}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                    isActive(link.to)
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
              </button>

              {/* Language */}
              <button
                onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
                className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors uppercase"
              >
                <Globe size={14} />
                {lang}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Messages */}
                  <Link
                    to="/messages"
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Messages"
                  >
                    <MessageSquare size={18} />
                  </Link>

                  {/* Profile */}
                  <div className="relative ml-1" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Avatar name={user?.fullName} size="xs" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate hidden xl:inline">
                        {user?.fullName}
                      </span>
                      <ChevronDown size={12} className="text-gray-400 hidden xl:block" />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1 animate-scale-in overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Avatar name={user?.fullName} size="sm" />
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{user?.role} &middot; {user?.email}</p>
                        </div>

                        {user?.role !== 'buyer' ? (
                          <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <LayoutDashboard size={16} /> {t('Dashboard', 'Dashibodi')}
                          </Link>
                        ) : (
                          <>
                            <Link to="/market" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <Building size={16} /> {t('Browse Properties', 'Vinjari Mali')}
                            </Link>
                            <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <Heart size={16} /> {t('Saved', 'Zilizohifadhiwa')}
                            </Link>
                          </>
                        )}

                        <Link to="/sell" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <DollarSign size={16} /> {t('Sell Property', 'Uza Mali')}
                        </Link>
                        <Link to="/messages" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <MessageSquare size={16} /> {t('Messages', 'Jumbe')}
                        </Link>
                        <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <Settings size={16} /> {t('Settings', 'Mipangilio')}
                        </Link>

                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                          <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
                            <LogOut size={16} /> {t('Sign Out', 'Ondoka')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button variant="ghost" size="sm">{t('Sign In', 'Ingia')}</Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button size="sm">{t('Get Started', 'Anza')}</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="flex lg:hidden items-center gap-1">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>
              {isAuthenticated && (
                <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg text-gray-500 relative">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg" aria-label="Toggle menu">
                {mobileOpen ? <X size={24} className="text-gray-700 dark:text-gray-300" /> : <Menu size={24} className="text-gray-700 dark:text-gray-300" />}
              </button>
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile slide-out overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/30 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          {/* Slide-out panel */}
          <div className="lg:hidden fixed top-16 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 animate-slide-down shadow-xl">
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive(link.to)
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}

              <hr className="my-2 border-gray-100 dark:border-gray-800" />

              {isAuthenticated ? (
                <>
                  {user?.role !== 'buyer' && (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                      <LayoutDashboard size={18} /> {t('Dashboard', 'Dashibodi')}
                    </Link>
                  )}
                  <Link to="/sell" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                    <DollarSign size={18} /> {t('Sell Property', 'Uza Mali')}
                  </Link>
                  <Link to="/notifications" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell size={18} /> {t('Notifications', 'Arifa')}
                  </Link>
                  <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings size={18} /> {t('Settings', 'Mipangilio')}
                  </Link>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                    <LogOut size={18} /> {t('Sign Out', 'Ondoka')}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm">{t('Sign In', 'Ingia')}</Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setMobileOpen(false)}>
                    <Button size="sm">{t('Get Started', 'Anza')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-premium border-t border-gray-200/50 dark:border-gray-800/50 px-2 py-2 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {(isAuthenticated && user?.role !== 'buyer'
            ? [
                { to: '/', icon: Home, label: t('Home', 'Nyumbani'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '/market', icon: Search, label: t('Search', 'Tafuta'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '/dashboard', icon: LayoutDashboard, label: t('Dashboard', 'Dashibodi'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '/notifications', icon: Bell, label: t('Alerts', 'Arifa'), badge: unreadCount, special: undefined as boolean | undefined },
                { to: '/settings', icon: User, label: t('Account', 'Akaunti'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
              ]
            : isAuthenticated
            ? [
                { to: '/', icon: Home, label: t('Home', 'Nyumbani'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '/market', icon: Search, label: t('Search', 'Tafuta'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '#ai', icon: Sparkles, label: t('Ask AI', 'Uliza'), special: true, badge: undefined as number | undefined },
                { to: '/sell', icon: DollarSign, label: t('Sell', 'Uza'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '/settings', icon: User, label: t('Account', 'Akaunti'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
              ]
            : [
                { to: '/', icon: Home, label: t('Home', 'Nyumbani'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '/market', icon: Search, label: t('Search', 'Tafuta'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
                { to: '#ai', icon: Sparkles, label: t('Ask AI', 'Uliza'), special: true, badge: undefined as number | undefined },
                { to: '/auth/register', icon: User, label: t('Join', 'Jiunge'), special: undefined as boolean | undefined, badge: undefined as number | undefined },
              ]
          ).map((item) => {
            if (item.special) {
              return (
                <button
                  key={item.to}
                  onClick={() => {
                    const aiBtn = document.querySelector('[class*="fixed bottom-6 right-6"]') as HTMLElement;
                    aiBtn?.click();
                  }}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-400 rounded-xl relative -mt-5"
                >
                  <div className="w-11 h-11 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 transition-transform hover:scale-105 active:scale-95">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl relative ${
                  location.pathname === item.to ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-0.5 right-1 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
