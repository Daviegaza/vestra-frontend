import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building, Shield, Users, Info, Menu, X, Bell, LogOut, User, Settings, MessageSquare, LayoutDashboard, Globe, Search, Home, Sparkles, Sun, Moon, Heart, DollarSign } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useRealtimeStore } from '../../store/realtimeStore';
import Button from '../ui/Button';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const { unreadCount, connect } = useRealtimeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'sw'>(() => (localStorage.getItem('vestra_lang') as 'en' | 'sw') || 'en');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) connect();
  }, [isAuthenticated, connect]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  useEffect(() => { localStorage.setItem('vestra_lang', lang); }, [lang]);

  const handleLogout = () => {
    logout();
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

  return (
    <>
      <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Building size={18} className="text-white" />
              </div>
              <span className="text-emerald-400">Vestra</span>
              <span className="hidden sm:inline text-xs bg-savannah-900/30 text-savannah-400 px-1.5 py-0.5 rounded font-normal">KE</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    location.pathname.startsWith(link.to)
                      ? 'bg-emerald-900/20 text-emerald-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-gray-400" />}
              </button>
              <button
                onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Globe size={14} className="text-gray-400" />
                <span className="uppercase text-gray-400">{lang}</span>
              </button>

              {isAuthenticated ? (
                <>
                  <Link to="/notifications" className="p-2 rounded-lg hover:bg-gray-800 relative cursor-pointer">
                    <Bell size={18} className="text-gray-400" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/messages" className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <MessageSquare size={18} className="text-gray-400" />
                  </Link>
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center">
                        <User size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-200">{user?.fullName}</span>
                    </button>
                    {profileOpen && (
                      <div className="absolute right-0 mt-1 w-52 bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-50 animate-scale-in">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">{user?.fullName}</p>
                          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                        <Link to="/sell" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"><DollarSign size={16} /> {t('Sell Property', 'Uza Mali')}</Link>
                        {user?.role !== 'buyer' ? (
                          <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"><LayoutDashboard size={16} /> {t('Dashboard', 'Dashibodi')}</Link>
                        ) : (
                          <>
                            <Link to="/market" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"><Building size={16} /> {t('Browse Properties', 'Vinjari Mali')}</Link>
                            <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"><Heart size={16} /> {t('Saved Properties', 'Zilizohifadhiwa')}</Link>
                          </>
                        )}
                        <Link to="/messages" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"><MessageSquare size={16} /> {t('Messages', 'Jumbe')}</Link>
                        <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"><Settings size={16} /> {t('Settings', 'Mipangilio')}</Link>
                        <div className="border-t border-gray-700 mt-1 pt-1">
                          <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 w-full rounded-b-xl cursor-pointer"><LogOut size={16} /> {t('Sign Out', 'Ondoka')}</button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth/login"><Button variant="ghost" size="sm">{t('Sign In', 'Ingia')}</Button></Link>
                  <Link to="/auth/register"><Button size="sm">{t('Get Started', 'Anza')}</Button></Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')} className="p-2 rounded-lg cursor-pointer">
                <Globe size={18} className="text-gray-400" />
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 cursor-pointer">
                {mobileOpen ? <X size={24} className="text-gray-300" /> : <Menu size={24} className="text-gray-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-out menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-800 px-4 py-3 space-y-1 bg-gray-900">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-emerald-900/20 text-emerald-400'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}>
                <link.icon size={18} />{link.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-700" />
            {isAuthenticated ? (
              <>
                {user?.role !== 'buyer' && (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 cursor-pointer">{t('Dashboard', 'Dashibodi')}</Link>
                )}
                <Link to="/market" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 cursor-pointer">{t('Browse Properties', 'Vinjari Mali')}</Link>
                <Link to="/notifications" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 cursor-pointer">{t('Notifications', 'Arifa')}</Link>
                <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 cursor-pointer">{t('Settings', 'Mipangilio')}</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/20 w-full cursor-pointer">{t('Sign Out', 'Ondoka')}</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm">{t('Sign In', 'Ingia')}</Button></Link>
                <Link to="/auth/register" onClick={() => setMobileOpen(false)}><Button size="sm">{t('Get Started', 'Anza')}</Button></Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 px-2 py-1.5">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {(isAuthenticated && role !== 'buyer'
            ? [
                { to: '/', icon: Home, label: t('Home', 'Nyumbani') },
                { to: '/market', icon: Search, label: t('Search', 'Tafuta') },
                { to: '/dashboard', icon: LayoutDashboard, label: t('Dashboard', 'Dashibodi') },
                { to: '/notifications', icon: Bell, label: t('Alerts', 'Arifa') },
                { to: '/settings', icon: User, label: t('Account', 'Akaunti') },
              ]
            : isAuthenticated
            ? [
                { to: '/', icon: Home, label: t('Home', 'Nyumbani') },
                { to: '/market', icon: Search, label: t('Search', 'Tafuta') },
                { to: '#ai', icon: Sparkles, label: t('Ask AI', 'Uliza') },
                { to: '/sell', icon: DollarSign, label: t('Sell', 'Uza') },
                { to: '/settings', icon: User, label: t('Account', 'Akaunti') },
              ]
            : [
                { to: '/', icon: Home, label: t('Home', 'Nyumbani') },
                { to: '/market', icon: Search, label: t('Search', 'Tafuta') },
                { to: '#ai', icon: Sparkles, label: t('Ask AI', 'Uliza') },
                { to: '/auth/register', icon: User, label: t('Join', 'Jiunge') },
              ]
          ).map((item) => {
            const isAi = item.to === '#ai';
            return isAi ? (
              <button
                key={item.to}
                onClick={() => {
                  const aiBtn = document.querySelector('[class*="fixed bottom-6 right-6"]') as HTMLElement;
                  aiBtn?.click();
                }}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-400 rounded-lg cursor-pointer"
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg cursor-pointer ${
                  location.pathname === item.to ? 'text-emerald-400' : 'text-gray-400'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
