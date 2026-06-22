import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Sparkles, LogIn } from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import { PropertyGridSkeleton } from '../../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../../components/ui/ErrorBoundary';
import { useProperties } from '../../hooks/useProperties';
import { useAuthStore } from '../../store/authStore';
import MarketPulseTicker from '../../components/property/MarketPulseTicker';
import type { PropertyType, ListingType } from '../../types';

const propertyTypes: { value: PropertyType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'student_housing', label: 'Student Housing' },
  { value: 'short_stay', label: 'Short Stay' },
];

const listingTypes: { value: ListingType | ''; label: string }[] = [
  { value: '', label: 'All Listings' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
];

const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Kilifi', 'Machakos', 'Kwale'];

export default function Market() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<PropertyType | ''>('');
  const [listing, setListing] = useState<ListingType | ''>('');
  const [county, setCounty] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBed, setMinBed] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 9;

  const filters = useMemo(() => ({
    q: search, type, listing, county,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minBed: minBed ? Number(minBed) : undefined,
    page,
    perPage,
  }), [search, type, listing, county, minPrice, maxPrice, minBed, page]);

  const { data, loading, error, refetch } = useProperties(filters);

  const clearFilters = () => {
    setSearch('');
    setType('');
    setListing('');
    setCounty('');
    setMinPrice('');
    setMaxPrice('');
    setMinBed('');
    setPage(1);
  };

  const { isAuthenticated } = useAuthStore();
  const hasFilters = !!(search || type || listing || county || minPrice || maxPrice || minBed);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MarketPulseTicker />
      <div className="mb-8 mt-6">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">Property Market</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{data ? `${data.total} verified properties available` : 'Loading properties...'}</p>
      </div>

      {!isAuthenticated && (
        <Card className="p-4 mb-6 bg-gradient-to-r from-emerald-600/10 to-rift-600/10 border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Sign in to view full property details</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Get trust scores, contact agents, schedule viewings, and more.</p>
          </div>
          <Link to="/auth/login"><Button size="sm"><LogIn size={14} className="mr-1" /> Sign In</Button></Link>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
        <div className="flex-1 relative w-full">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder-gray-400"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters {hasFilters && `(${data?.total || 0})`}
        </Button>
        <div className="relative w-full sm:w-64">
          <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
          <input
            type="text"
            placeholder="AI search: '3BR near Westlands'"
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Property Type</label>
            <select value={type} onChange={(e) => { setType(e.target.value as PropertyType | ''); setPage(1); }} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white">
              {propertyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Listing Type</label>
            <select value={listing} onChange={(e) => { setListing(e.target.value as ListingType | ''); setPage(1); }} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white">
              {listingTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">County</label>
            <select value={county} onChange={(e) => { setCounty(e.target.value); setPage(1); }} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white">
              <option value="">All Counties</option>
              {counties.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Min Price" type="number" placeholder="0" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
            <Input label="Max Price" type="number" placeholder="Any" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
          </div>
          <div>
            <Input label="Min Bedrooms" type="number" placeholder="0" value={minBed} onChange={(e) => { setMinBed(e.target.value); setPage(1); }} />
          </div>
          <div className="flex items-end">
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 py-2.5">
              <X size={14} /> Clear Filters
            </button>
          </div>
        </div>
      )}

      {loading && <PropertyGridSkeleton count={9} />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {data && data.items.length === 0 && !loading && (
        <EmptyState message="No properties match your criteria." action={<button onClick={clearFilters} className="text-emerald-600 hover:underline text-sm">Clear filters</button>} />
      )}

      {data && data.items.length > 0 && (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, data.total)} of {data.total} properties
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.items.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          {data.pages > 1 && (
            <div className="flex justify-center">
              <Pagination current={page} total={data.pages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
