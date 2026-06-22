import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-gray-900 dark:text-white mb-4">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <Building size={18} className="text-white" />
              </div>
              Vestra
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold uppercase ml-1">KE</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              AI-powered property trust platform. Making real estate safe, transparent, and efficient across all 47 counties.
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Heart size={10} className="text-terracotta-400" fill="currentColor" /> Made for Kenya
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/market', label: 'Browse Properties' },
                { to: '/verify', label: 'Verify Property' },
                { to: '/agents', label: 'Find an Agent' },
                { to: '/sell', label: 'Sell Property' },
                { to: '/insights', label: 'Market Insights' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/blog', label: 'Blog & Guides' },
                { to: '/faq', label: 'FAQ' },
                { to: '/contact', label: 'Contact' },
                { to: '/dashboard/chama', label: 'Chama Investing' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                Westlands Business Park<br />Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <Phone size={16} className="text-emerald-500" />
                +254 700 123 456
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <Mail size={16} className="text-emerald-500" />
                hello@vestra.co.ke
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">&copy; 2026 Vestra Properties Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
