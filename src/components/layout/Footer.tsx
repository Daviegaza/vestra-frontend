import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white mb-4">
              <Building size={24} className="text-emerald-500" />
              Vestra
            </Link>
            <p className="text-sm leading-relaxed">
              AI-Powered Property Trust Platform. Making real estate transactions safe, transparent, and efficient across Kenya.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link to="/market" className="block hover:text-emerald-500 transition-colors">Browse Properties</Link>
              <Link to="/verify" className="block hover:text-emerald-500 transition-colors">Verify Property</Link>
              <Link to="/agents" className="block hover:text-emerald-500 transition-colors">Find an Agent</Link>
              <Link to="/dashboard" className="block hover:text-emerald-500 transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block hover:text-emerald-500 transition-colors">About Us</Link>
              <Link to="/faq" className="block hover:text-emerald-500 transition-colors">FAQ</Link>
              <Link to="/contact" className="block hover:text-emerald-500 transition-colors">Contact</Link>
              <Link to="/blog" className="block hover:text-emerald-500 transition-colors">Blog</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> Westlands Business Park, Nairobi, Kenya</div>
              <div className="flex items-center gap-2"><Phone size={16} /> +254 700 123 456</div>
              <div className="flex items-center gap-2"><Mail size={16} /> hello@vestra.co.ke</div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; 2026 Vestra. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-emerald-500 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-emerald-500 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
