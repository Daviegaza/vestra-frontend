import { useParams, Link } from 'react-router-dom';
import { Star, Phone, Mail, MapPin, Award, ArrowLeft, Briefcase, Home, TrendingUp } from 'lucide-react';
import { getAgentById } from '../../data/agents';
import { properties } from '../../data/properties';
import Button from '../../components/ui/Button';
import PropertyCard from '../../components/property/PropertyCard';

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const agent = getAgentById(id || '');

  if (!agent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Agent Not Found</h1>
        <Link to="/agents" className="text-emerald-600 hover:underline">Back to Agents</Link>
      </div>
    );
  }

  const agentProperties = properties.filter((p) => p.agentId === agent.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/agents" className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6">
        <ArrowLeft size={16} /> Back to Agents
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <img src={agent.avatar} alt={agent.name} className="w-24 h-24 rounded-full object-cover" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{agent.name}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium capitalize">
                <Award size={12} /> {agent.badgeLevel}
              </span>
            </div>
            <p className="text-gray-500">{agent.agencyName} &middot; License: {agent.licenseNumber}</p>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={16} fill="currentColor" /> {agent.rating} <span className="text-gray-400 text-sm">({agent.reviewCount} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={14} /> {agent.city}, {agent.county}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {agent.phone}</span>
              <span className="flex items-center gap-1"><Mail size={14} /> {agent.email}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{agent.bio}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button><Phone size={16} /> Call</Button>
            <Button variant="outline"><Mail size={16} /> Email</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Listings', value: agent.listingCount, icon: Home },
          { label: 'Sold', value: agent.soldCount, icon: TrendingUp },
          { label: 'Specialties', value: agent.specialties.length, icon: Briefcase },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <s.icon size={20} className="mx-auto text-emerald-600 mb-1" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Agent Listings</h2>
      {agentProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No listings currently.</p>
      )}
    </div>
  );
}
