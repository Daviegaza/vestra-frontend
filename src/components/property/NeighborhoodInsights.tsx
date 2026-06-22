import { MapPin, TrendingUp, TrendingDown, Shield, Building, GraduationCap, ShoppingBag, Bus, Trees } from 'lucide-react';
import Card from '../ui/Card';

interface NeighborhoodData {
  city: string;
  area: string;
  avgPricePerSqm: number;
  priceTrend: number;
  rentalDemand: 'high' | 'medium' | 'low';
  safetyScore: number;
  developmentScore: number;
  amenities: {
    schools: number;
    hospitals: number;
    shopping: number;
    transport: number;
    parks: number;
  };
  highlights: string[];
}

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: typeof Shield }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1 text-xs text-gray-500"><Icon size={12} /> {label}</span>
        <span className="text-xs font-semibold text-gray-900 dark:text-white">{score}/100</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

const demandColors = { high: 'text-red-600 bg-red-50 dark:bg-red-900/20', medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' };

const defaultData: NeighborhoodData = {
  city: 'Nairobi', area: 'Karen',
  avgPricePerSqm: 185000, priceTrend: 12.4,
  rentalDemand: 'high', safetyScore: 85, developmentScore: 72,
  amenities: { schools: 12, hospitals: 4, shopping: 8, transport: 15, parks: 6 },
  highlights: ['Safe Area 85/100', 'Fast Appreciating +12%', 'High Rental Demand', 'Premium Schools Nearby'],
};

export default function NeighborhoodInsights({ data = defaultData }: { data?: NeighborhoodData }) {
  return (
    <Card className="p-5 space-y-5">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-emerald-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white">{data.area}, {data.city}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500">Avg Price/sqm</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">KES {data.avgPricePerSqm.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            {data.priceTrend > 0 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
            <span className={`text-xs font-semibold ${data.priceTrend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{data.priceTrend > 0 ? '+' : ''}{data.priceTrend}% YoY</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500">Rental Demand</p>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${demandColors[data.rentalDemand]}`}>{data.rentalDemand}</span>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar label="Safety" score={data.safetyScore} icon={Shield} />
        <ScoreBar label="Development" score={data.developmentScore} icon={Building} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Nearby Amenities</p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { icon: GraduationCap, label: 'Schools', count: data.amenities.schools },
            { icon: Building, label: 'Hospitals', count: data.amenities.hospitals },
            { icon: ShoppingBag, label: 'Shops', count: data.amenities.shopping },
            { icon: Bus, label: 'Transport', count: data.amenities.transport },
            { icon: Trees, label: 'Parks', count: data.amenities.parks },
          ].map(({ icon: Icon, label, count }) => (
            <div key={label} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Icon size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {data.highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.highlights.map((h) => (
            <span key={h} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-medium">{h}</span>
          ))}
        </div>
      )}
    </Card>
  );
}
