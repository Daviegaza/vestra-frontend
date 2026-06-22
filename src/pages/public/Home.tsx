import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, Smartphone, Users, MapPin, Award, Star, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PropertyCard from '../../components/property/PropertyCard';
import { PropertyGridSkeleton } from '../../components/ui/Skeleton';
import { useFeaturedProperties } from '../../hooks/useProperties';
import { agents } from '../../data/agents';

const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Kilifi'];
const topAgents = agents.filter((a) => a.badgeLevel === 'platinum' || a.badgeLevel === 'gold').slice(0, 6);

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: featured, loading } = useFeaturedProperties();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/market?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="-mt-16">
      {/* HERO */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-950 to-acacia-950" />
        <div className="absolute inset-0 pattern-kente opacity-10" />
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm">
            <Shield size={14} className="text-emerald-400" />
            <span className="text-gray-300 font-medium">Kenya's Most Trusted Property Platform</span>
            <Star size={12} className="text-amber-400" fill="currentColor" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05]">
              <span className="text-white">Buy Property</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400">Without Fear.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
              AI verification. Escrow protection. M-Pesa payments. The safest way to find, verify, and own property in Kenya.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder='Try "3BR under 20M near Karen"'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl px-8">
                <Search size={18} className="mr-2" /> Search
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-sm text-gray-500">
            {['AI-Verified Listings', 'M-Pesa Payments', 'Escrow Protected', 'All 47 Counties'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTY SELECTOR */}
      <section className="py-12 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <MapPin size={14} className="text-emerald-500" /> Browse by County
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {counties.map((c) => (
              <Link key={c} to={`/market?county=${c}`}
                className="px-5 py-2.5 bg-gray-800 hover:bg-emerald-900/30 text-gray-300 hover:text-emerald-400 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-emerald-700"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black text-white">How Vestra Protects You</h2>
            <p className="text-gray-400 max-w-lg mx-auto">From search to ownership — every step verified, every shilling protected.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', icon: Search, title: 'Search Verified', desc: 'Every listing checked. No ghosts. No fakes.', bg: 'bg-emerald-900/20' },
              { step: '02', icon: Shield, title: 'AI Verification', desc: 'Title deeds, registry, history — analyzed in seconds.', bg: 'bg-rift-900/20' },
              { step: '03', icon: Lock, title: 'Secure Escrow', desc: 'M-Pesa deposit held safely until title is yours.', bg: 'bg-amber-900/20' },
              { step: '04', icon: Award, title: 'Own Confidently', desc: 'Blockchain title tracking. Immutable proof.', bg: 'bg-terracotta-900/20' },
            ].map((item) => (
              <Card key={item.step} className="p-6 relative overflow-hidden border-gray-700 hover:border-emerald-700 transition-all duration-300">
                <div className="absolute top-0 right-0 text-7xl font-black text-gray-800 leading-none -mt-2 -mr-1">{item.step}</div>
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4 relative z-10`}>
                  <item.icon size={22} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-white mb-2 relative z-10">{item.title}</h3>
                <p className="text-sm text-gray-400 relative z-10">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl lg:text-5xl font-black text-white">Featured Properties</h2>
              <p className="text-gray-400">Verified. Trusted. Ready for you.</p>
            </div>
            <Link to="/market" className="hidden sm:flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:underline">
              View All <ArrowRight size={16} />
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
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-950 via-gray-950 to-acacia-950">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-4xl lg:text-5xl font-black text-center text-white">Trusted Across Kenya</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: 'Active Users' },
              { value: '12,000+', label: 'Properties Listed' },
              { value: 'KES 2B+', label: 'Fraud Prevented' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">{s.value}</p>
                <p className="text-sm text-gray-400 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP AGENTS */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl lg:text-5xl font-black text-white">Top Verified Agents</h2>
              <p className="text-gray-400">Licensed. Rated. Trusted.</p>
            </div>
            <Link to="/agents" className="hidden sm:flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:underline">
              All Agents <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topAgents.map((a) => (
              <Link to={`/agents/${a.id}`} key={a.id}>
                <Card className="p-5 text-center space-y-3 border-gray-700 hover:border-emerald-600 transition-all duration-300">
                  <img src={a.avatar} alt={a.name} className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-emerald-900" />
                  <div>
                    <p className="font-semibold text-sm text-white">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.agencyName.slice(0, 15)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="text-amber-500" fill="currentColor" />
                    <span className="text-xs font-bold text-gray-300">{a.rating}</span>
                  </div>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 uppercase font-semibold tracking-wider">{a.badgeLevel}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMA CTA */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-acacia-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <Users size={28} className="text-acacia-400" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white">Buy with Your Chama</h2>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">Pool funds transparently. Vote on properties. Track every shilling. The first platform built for Kenyan investment groups.</p>
          <Link to="/dashboard/chama"><Button size="lg" className="rounded-xl px-8 bg-acacia-600 hover:bg-acacia-700">Start a Chama</Button></Link>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 px-4 bg-gray-800">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <Smartphone size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white">Ready to Own Without Fear?</h2>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">Join 50,000+ Kenyans who trust Vestra to verify, transact, and secure their property investments.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth/register"><Button size="lg" className="rounded-xl px-8">Get Started Free</Button></Link>
            <Link to="/sell"><Button size="lg" variant="outline" className="rounded-xl px-8">Sell Your Property</Button></Link>
            <Link to="/verify"><Button size="lg" variant="outline" className="rounded-xl px-8">Verify a Property</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
