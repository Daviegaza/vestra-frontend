import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Home, Building, Users, Shield, LayoutDashboard,
  Settings, MessageSquare, Bell, FileText, CreditCard,
  TrendingUp, Wrench, ArrowRight, CornerDownLeft, PlusCircle,
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
  category: 'navigation' | 'action' | 'property';
  keywords?: string[];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: Command[] = [
    { id: 'home', label: 'Home', description: 'Go to homepage', icon: Home, action: () => navigate('/'), category: 'navigation', keywords: ['index', 'main'] },
    { id: 'market', label: 'Browse Properties', description: 'Search the property market', icon: Building, action: () => navigate('/market'), category: 'navigation', keywords: ['buy', 'house', 'land'] },
    { id: 'agents', label: 'Find Agents', description: 'Browse verified agents', icon: Users, action: () => navigate('/agents'), category: 'navigation', keywords: ['realtor', 'broker'] },
    { id: 'verify', label: 'Verify Property', description: 'Check property authenticity', icon: Shield, action: () => navigate('/verify'), category: 'action', keywords: ['trust', 'score', 'check'] },
    { id: 'dashboard', label: 'Dashboard', description: 'Your personal dashboard', icon: LayoutDashboard, action: () => navigate('/dashboard'), category: 'navigation', keywords: ['overview', 'stats'] },
    { id: 'messages', label: 'Messages', description: 'View your messages', icon: MessageSquare, action: () => navigate('/messages'), category: 'navigation', keywords: ['chat', 'inbox'] },
    { id: 'notifications', label: 'Notifications', description: 'View alerts', icon: Bell, action: () => navigate('/notifications'), category: 'navigation', keywords: ['alerts'] },
    { id: 'settings', label: 'Settings', description: 'Manage your account', icon: Settings, action: () => navigate('/settings'), category: 'navigation', keywords: ['profile', 'account'] },
    { id: 'sell', label: 'Sell Property', description: 'List a property for sale', icon: PlusCircle, action: () => navigate('/sell'), category: 'action', keywords: ['list', 'post'] },
    { id: 'insights', label: 'Market Insights', description: 'View market trends', icon: TrendingUp, action: () => navigate('/insights'), category: 'navigation', keywords: ['trends', 'analytics'] },
    { id: 'escrow', label: 'Escrow Management', description: 'Manage escrow transactions', icon: CreditCard, action: () => navigate('/dashboard/escrow'), category: 'action', keywords: ['payment', 'secure'] },
    { id: 'maintenance', label: 'Maintenance Hub', description: 'Property maintenance requests', icon: Wrench, action: () => navigate('/dashboard/maintenance'), category: 'action', keywords: ['repair', 'fix'] },
    { id: 'blog', label: 'Blog', description: 'Read property guides', icon: FileText, action: () => navigate('/blog'), category: 'navigation', keywords: ['articles', 'guides'] },
    { id: 'faq', label: 'FAQ', description: 'Frequently asked questions', icon: Search, action: () => navigate('/faq'), category: 'navigation', keywords: ['help', 'questions'] },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.label.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.keywords?.some((k) => k.includes(q))
        );
      })
    : commands;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === 'K' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const execute = useCallback(
    (command: Command) => {
      command.action();
      setOpen(false);
      setQuery('');
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) execute(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 cmdk-overlay"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages and actions..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                esc
              </kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No results found.</div>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === selectedIndex
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        i === selectedIndex
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <cmd.icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{cmd.label}</p>
                      {cmd.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cmd.description}</p>
                      )}
                    </div>
                    {i === selectedIndex && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CornerDownLeft size={12} /> Enter
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <ArrowRight size={10} className="rotate-90" /><ArrowRight size={10} className="-rotate-90" /> Navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={10} /> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 rounded">esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
