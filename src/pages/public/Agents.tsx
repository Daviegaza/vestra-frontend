import { Link } from 'react-router-dom';
import { Star, MapPin, Award } from 'lucide-react';
import { agents } from '../../data/agents';
import Card from '../../components/ui/Card';

const badgeColors: Record<string, string> = {
  platinum: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  silver: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function Agents() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Property Agents</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Work with licensed, verified real estate professionals.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <Link to={`/agents/${agent.id}`} key={agent.id}>
            <Card hover className="p-6 text-center space-y-4 h-full">
              <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-full object-cover mx-auto" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.agencyName}</p>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-amber-500">
                <Star size={14} fill="currentColor" />
                {agent.rating}
                <span className="text-gray-400">({agent.reviewCount})</span>
              </div>
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badgeColors[agent.badgeLevel]}`}>
                  <Award size={12} /> {agent.badgeLevel}
                </span>
              </div>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>{agent.listingCount} listings</span>
                <span>{agent.soldCount} sold</span>
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <MapPin size={12} /> {agent.city}, {agent.county}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
