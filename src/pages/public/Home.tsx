import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Shield, Building, Users, MapPin, Star, ArrowRight,
  CheckCircle, CreditCard, Home as HomeIcon, TrendingUp, Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PropertyCard from '../../components/property/PropertyCard';
import { PropertyGridSkeleton } from '../../components/ui/Skeleton';
import { useFeaturedProperties } from '../../hooks/useProperties';
import { agents } from '../../data/agents';
import { properties } from '../../data/properties';

const topAgents = agents.filter((a) => a.badgeLevel === 'platinum' || a.badgeLevel === 'gold').slice(0, 6);

// Quick nav cards shown right below hero
const quickLinks = [
  { to: '/market', icon: Building, label: 'Browse Properties', desc: 'Search verified listings across Kenya', color: 'emerald' as const },
  { to: '/verify', icon: Shield, label: 'Verify a Property', desc: 'Check title deeds & ownership', color: 'blue' as const },
  { to: '/agents', icon: Users, label: 'Find an Agent', desc: 'Licensed, rated professionals', color: 'amber' as const },
  { to: '/sell', icon: TrendingUp, label: 'Sell Property', desc: 'List with AI verification', color: 'purple' as const },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800', hover: 'hover:border-emerald-300 dark:hover:border-emerald-700', gradient: 'from-emerald-500/5 to-emerald-500/0' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800', hover: 'hover:border-blue-300 dark:hover:border-blue-700', gradient: 'from-blue-500/5 to-blue-500/0' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800', hover: 'hover:border-amber-300 dark:hover:border-amber-700', gradient: 'from-amber-500/5 to-amber-500/0' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800', hover: 'hover:border-purple-300 dark:hover:border-purple-700', gradient: 'from-purple-500/5 to-purple-500/0' },
};

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: featured, loading } = useFeaturedProperties();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/market?q=${encodeURIComponent(search)}`);
  };

  // Stats
  const verifiedCount = properties.filter(p => p.isVerified).length;
  const countyCount = [...new Set(properties.map(p => p.county))].length;

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative py-20 lg:py-28 px-4 overflow-hidden gradient-hero">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-sm">
            <Shield size={14} className="text-emerald-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Kenya's Most Trusted Property Platform</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] text-gray-900 dark:text-white">
              Buy & Sell Property
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600">
                Without Fear
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              AI verification. Escrow protection. M-Pesa payments. The safest way to own property in Kenya.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder='Search by location, type, or price...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-base"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl px-8">
                <Search size={18} className="mr-2" /> Search Properties
              </Button>
            </div>
          </form>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            {['AI-Verified Listings', 'Escrow Protected', 'M-Pesa Payments', `${countyCount} Counties`].map((t, i) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                {i === 3 ? `${verifiedCount}+ ${t}` : t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUICK NAVIGATION ===== */}
      <section className="py-12 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            What would you like to do?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const c = colorMap[link.color];
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative p-6 rounded-2xl border bg-gradient-to-br ${c.gradient} ${c.bg} ${c.border} ${c.hover} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${c.bg} ${c.text}`}>
                    <link.icon size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{link.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{link.desc}</p>
                  <ArrowRight size={16} className={`absolute bottom-4 right-4 ${c.text} opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1`} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== GET STARTED — FIRST TIME USERS ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/30 dark:via-gray-950 dark:to-emerald-950/30">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold">
              <Sparkles size={14} /> New Here?
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
              Get Started in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500">3 Easy Steps</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">
              Whether you're buying, selling, or just looking — we've got you covered. No jargon, no confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg z-10">
                1
              </div>
              <Card className="p-6 pt-8 h-full text-center space-y-3 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Search size={26} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Create Your Free Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Sign up in under a minute. No paperwork. Choose your role — buyer, seller, landlord, or agent — and we'll set up your dashboard.
                </p>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg z-10">
                2
              </div>
              <Card className="p-6 pt-8 h-full text-center space-y-3 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Building size={26} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Browse or List Property</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Search thousands of verified listings across all 47 counties. Or list your own property with AI verification built in.
                </p>
              </Card>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg z-10">
                3
              </div>
              <Card className="p-6 pt-8 h-full text-center space-y-3 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield size={26} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Transact with Confidence</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Pay via M-Pesa into secure escrow. Funds are only released when the title deed is verified and transferred to your name.
                </p>
              </Card>
            </div>
          </div>

          <div className="text-center space-y-3">
            <Link to="/auth/register">
              <Button size="xl" className="rounded-xl px-10 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all">
                Start Your Journey — It's Free <ArrowRight size={20} />
              </Button>
            </Link>
            <p className="text-xs text-gray-400">
              Join 50,000+ Kenyans already using Vestra. No credit card needed.
            </p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">How Vestra Protects You</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">Four simple steps — each designed to keep your money and property safe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', icon: Search, title: 'Search', desc: 'Browse verified listings. Every property checked for authenticity before it appears.', color: 'emerald' as const },
              { step: '2', icon: Shield, title: 'Verify', desc: 'AI analyzes title deeds, cross-references land registry. Get a trust score instantly.', color: 'blue' as const },
              { step: '3', icon: CreditCard, title: 'Pay Securely', desc: 'Deposit into escrow via M-Pesa. Funds held safely until title transfer is confirmed.', color: 'amber' as const },
              { step: '4', icon: HomeIcon, title: 'Own Confidently', desc: 'Title transferred. Funds released. You get immutable proof of ownership.', color: 'purple' as const },
            ].map((item) => (
              <Card key={item.step} className="p-6 text-center space-y-3 relative overflow-hidden border-gray-200 dark:border-gray-700">
                <div className="absolute -top-4 -right-4 text-7xl font-black text-gray-100 dark:text-gray-800 leading-none select-none">
                  {item.step}
                </div>
                <div className="relative z-10 space-y-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                    item.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                    item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    item.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  }`}>
                    <item.icon size={26} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Featured Properties</h2>
              <p className="text-gray-500 dark:text-gray-400">Verified. Trusted. Ready for you to visit.</p>
            </div>
            <Link to="/market" className="hidden sm:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <PropertyGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(featured || []).slice(0, 4).map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}

          <div className="text-center sm:hidden">
            <Link to="/market">
              <Button variant="outline" size="lg">View All Properties <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 dark:from-emerald-950 via-white dark:via-gray-950 to-acacia-50 dark:to-acacia-950">
        <div className="max-w-5xl mx-auto space-y-10">
          <h2 className="text-3xl lg:text-4xl font-black text-center text-gray-900 dark:text-white">
            Trusted Across Kenya
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: 'Active Users' },
              { value: '12,000+', label: 'Properties Listed' },
              { value: 'KES 2B+', label: 'Fraud Prevented' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <p className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600">
                  {s.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP AGENTS ===== */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Top Verified Agents</h2>
              <p className="text-gray-500 dark:text-gray-400">Licensed by EARB. Rated by the community.</p>
            </div>
            <Link to="/agents" className="hidden sm:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
              Browse All Agents <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {topAgents.map((a) => (
              <Link to={`/agents/${a.id}`} key={a.id} className="group">
                <Card className="p-5 text-center space-y-3 hover:shadow-lg transition-all duration-300">
                  <img src={a.avatar} alt={a.name} className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-emerald-100 dark:ring-emerald-900 group-hover:ring-emerald-500 transition-all" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{a.name}</p>
                    <p className="text-xs text-gray-500 truncate">{a.agencyName.slice(0, 18)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="text-amber-500" fill="currentColor" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{a.rating}</span>
                  </div>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                    {a.badgeLevel}
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link to="/agents">
              <Button variant="outline" size="lg">Browse All Agents <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
              Ready to Own Without Fear?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-lg">
              Join thousands of Kenyans who trust Vestra to verify, transact, and secure their property investments.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="rounded-xl px-8">Get Started — It's Free</Button>
            </Link>
            <Link to="/sell">
              <Button size="lg" variant="outline" className="rounded-xl px-8">Sell Your Property</Button>
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            No credit card required. Free account includes property browsing and basic verification.
          </p>
        </div>
      </section>
    </div>
  );
}
