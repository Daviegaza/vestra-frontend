import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Eye, Shield, Heart, TrendingUp } from 'lucide-react';
import type { Property } from '../../types';
import { Badge } from '../ui/Card';
import { useWishlistStore } from '../../store/wishlistStore';

function formatPrice(price: number, currency: string, listingType: string): string {
  const formatted = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(price);
  return `${currency} ${formatted}${listingType === 'rent' ? '/mo' : ''}`;
}

export default function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggle } = useWishlistStore();
  const liked = isFavorite(property.id);

  return (
    <Link to={`/properties/${property.id}`} className="block group">
      <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-sm group-hover:shadow-2xl group-hover:border-emerald-700 transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-52 object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-3 left-3 flex gap-1.5">
            {property.isFeatured && <Badge variant="warning">Featured</Badge>}
            {property.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/90 text-white text-xs font-semibold rounded-full">
                <Shield size={10} /> Verified
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(property.id); }}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
              liked ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-3 py-1.5 bg-black/70 rounded-lg text-sm font-bold text-emerald-400">
              {formatPrice(property.price, property.currency, property.listingType)}
            </span>
            {property.trustScore >= 85 && (
              <span className="px-2 py-1 bg-amber-500/90 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                <TrendingUp size={10} /> {property.trustScore}%
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MapPin size={13} />
            <span className="line-clamp-1">{property.city}, {property.county}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            {property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms}</span>}
            {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms}</span>}
            <span className="flex items-center gap-1"><Square size={13} /> {property.sizeSqft.toLocaleString()} sqft</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2.5 border-t border-gray-700">
            <span className="flex items-center gap-1"><Eye size={11} /> {property.views} views</span>
            <Badge variant={property.listingType === 'sale' ? 'info' : 'success'}>
              {property.listingType === 'sale' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'For Lease'}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
