import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, MapPin, Bed, Bath, Square, Calendar, Shield, TrendingUp } from 'lucide-react';
import { properties } from '../../data/properties';
import Card from '../../components/ui/Card';

function formatPrice(p: (typeof properties)[0]) {
  const f = new Intl.NumberFormat('en-KE').format(p.price);
  return `KES ${f}${p.listingType === 'rent' ? '/mo' : ''}`;
}

export default function PropertyCompare() {
  const [selected, setSelected] = useState<string[]>([]);

  const addProperty = (id: string) => {
    if (selected.length < 3 && !selected.includes(id)) setSelected([...selected, id]);
  };

  const removeProperty = (id: string) => {
    setSelected(selected.filter((s) => s !== id));
  };

  const props = selected.map((id) => properties.find((p) => p.id === id)!).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/market" className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-2"><ArrowLeft size={16} /> Back to Market</Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select up to 3 properties to compare side by side.</p>
        </div>
      </div>

      {selected.length < 3 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Add properties to compare:</h3>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {properties.filter((p) => !selected.includes(p.id)).map((p) => (
              <button
                key={p.id}
                onClick={() => addProperty(p.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors"
              >
                <Plus size={14} /> {p.title.slice(0, 30)}...
              </button>
            ))}
          </div>
        </Card>
      )}

      {props.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Select properties from the list above to compare.</p>
        </div>
      )}

      {props.length > 0 && (
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${props.length}, 1fr)` }}>
          {props.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="relative">
                <img src={p.images[0]} alt={p.title} className="w-full h-44 object-cover" />
                <button onClick={() => removeProperty(p.id)} className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow"><X size={14} /></button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xl font-bold text-emerald-600">{formatPrice(p)}</p>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {p.city}, {p.county}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  {p.bedrooms > 0 && <span><Bed size={12} className="inline mr-1" />{p.bedrooms} Beds</span>}
                  {p.bathrooms > 0 && <span><Bath size={12} className="inline mr-1" />{p.bathrooms} Baths</span>}
                  <span><Square size={12} className="inline mr-1" />{p.sizeSqft.toLocaleString()} sqft</span>
                  {p.yearBuilt > 0 && <span><Calendar size={12} className="inline mr-1" />Built {p.yearBuilt}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Shield size={12} className={p.isVerified ? 'text-emerald-500' : 'text-gray-400'} />
                    <span className="text-xs">{p.isVerified ? 'Verified' : 'Unverified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className={p.trustScore >= 90 ? 'text-emerald-500' : 'text-amber-500'} />
                    <span className="text-xs">{p.trustScore}%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.amenities.slice(0, 4).map((a) => (
                    <span key={a} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">{a}</span>
                  ))}
                </div>
                <Link to={`/properties/${p.id}`} className="block text-center text-sm text-emerald-600 font-medium hover:underline pt-1">View Details</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
