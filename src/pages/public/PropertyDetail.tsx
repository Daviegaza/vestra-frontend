import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Bed, Bath, Square, Calendar, Shield, Phone, Star, ArrowLeft, Eye, AlertTriangle, CheckCircle, Smartphone, Heart } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { Badge } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { WhatsAppChat, WhatsAppShare } from '../../components/social/WhatsAppButton';
import MPesaPayment, { MPesaBadge } from '../../components/payment/MPesaPayment';
import PropertyCard from '../../components/property/PropertyCard';
import NeighborhoodInsights from '../../components/property/NeighborhoodInsights';
import { DetailPageSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorBoundary';
import { useProperty, useSimilarProperties } from '../../hooks/useProperties';
import { useAgent } from '../../hooks/useAgents';
import { useWishlistStore } from '../../store/wishlistStore';
import { toast } from '../../store/toastStore';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngTuple } from 'leaflet';

function SetView({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function formatPrice(price: number, currency: string, listingType: string): string {
  const formatted = new Intl.NumberFormat('en-KE').format(price);
  return `${currency} ${formatted}${listingType === 'rent' ? '/mo' : ''}`;
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, loading, error, refetch } = useProperty(id || '');
  const { data: agent } = useAgent(property?.agentId || '');
  const { data: similar } = useSimilarProperties(id || '', 3);
  const { isFavorite, toggle } = useWishlistStore();
  const [showMpesa, setShowMpesa] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><DetailPageSkeleton /></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8"><ErrorState message={error} onRetry={refetch} /></div>;
  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property Not Found</h1>
        <Link to="/market" className="text-emerald-600 hover:underline">Back to Market</Link>
      </div>
    );
  }

  const saved = isFavorite(property.id);
  const trustColor = property.trustScore >= 90 ? 'text-emerald-500' : property.trustScore >= 80 ? 'text-amber-500' : 'text-red-500';
  const trustStrokeColor = property.trustScore >= 90 ? '#10b981' : property.trustScore >= 80 ? '#f59e0b' : '#ef4444';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/market" className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6">
        <ArrowLeft size={16} /> Back to Market
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden mb-8">
        <img src={property.images[0]} alt={property.title} className="w-full h-80 md:h-96 object-cover" />
        <div className="grid grid-cols-2 gap-2">
          {property.images.slice(1).map((img, i) => (
            <img key={i} src={img} alt={`${property.title} ${i + 2}`} className="w-full h-40 md:h-[188px] object-cover" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={property.listingType === 'sale' ? 'info' : 'success'}>
                For {property.listingType === 'sale' ? 'Sale' : property.listingType === 'rent' ? 'Rent' : 'Lease'}
              </Badge>
              {property.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-medium">
                  <Shield size={12} /> Vestra Verified
                </span>
              )}
              {property.isFeatured && <Badge variant="warning">Featured</Badge>}
              <MPesaBadge />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              <MapPin size={14} /> {property.address}, {property.city}, {property.county}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-3xl font-bold text-emerald-600">{formatPrice(property.price, property.currency, property.listingType)}</p>
            <div className="flex gap-2">
              <Button onClick={() => setShowSchedule(true)}><Phone size={16} /> Schedule Viewing</Button>
              {agent && <WhatsAppChat phone={agent.phone} name={agent.name} variant="button" />}
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            {property.bedrooms > 0 && <div><Bed size={18} className="mx-auto text-gray-400 mb-1" /><p className="text-sm font-medium text-gray-900 dark:text-white">{property.bedrooms}</p><p className="text-[10px] text-gray-500">Beds</p></div>}
            {property.bathrooms > 0 && <div><Bath size={18} className="mx-auto text-gray-400 mb-1" /><p className="text-sm font-medium text-gray-900 dark:text-white">{property.bathrooms}</p><p className="text-[10px] text-gray-500">Baths</p></div>}
            <div><Square size={18} className="mx-auto text-gray-400 mb-1" /><p className="text-sm font-medium text-gray-900 dark:text-white">{property.sizeSqft.toLocaleString()}</p><p className="text-[10px] text-gray-500">Sqft</p></div>
            {property.yearBuilt > 0 && <div><Calendar size={18} className="mx-auto text-gray-400 mb-1" /><p className="text-sm font-medium text-gray-900 dark:text-white">{property.yearBuilt}</p><p className="text-[10px] text-gray-500">Year Built</p></div>}
            <div><Eye size={18} className="mx-auto text-gray-400 mb-1" /><p className="text-sm font-medium text-gray-900 dark:text-white">{property.views}</p><p className="text-[10px] text-gray-500">Views</p></div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{property.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span key={a} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">{a}</span>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Location</h2>
            <div className="h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              <MapContainer
                className="h-full w-full"
                key={`map-${property.id}`}
              >
                <SetView center={[property.lat, property.lng]} zoom={14} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[property.lat, property.lng] as LatLngTuple}>
                  <Popup>{property.title}<br />{formatPrice(property.price, property.currency, property.listingType)}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <NeighborhoodInsights data={{ city: property.city, area: property.city, avgPricePerSqm: Math.round(property.price / (property.sizeSqft || 1)), priceTrend: 8 + Math.random() * 10, rentalDemand: property.listingType === 'rent' ? 'high' : 'medium', safetyScore: property.trustScore, developmentScore: 60 + Math.floor(Math.random() * 30), amenities: { schools: 5 + Math.floor(Math.random() * 10), hospitals: 2 + Math.floor(Math.random() * 4), shopping: 4 + Math.floor(Math.random() * 8), transport: 8 + Math.floor(Math.random() * 12), parks: 3 + Math.floor(Math.random() * 5) }, highlights: [`Trust Score ${property.trustScore}%`, property.isVerified ? 'Vestra Verified' : 'Pending Verification', `${property.bedrooms > 0 ? property.bedrooms + ' Bedrooms' : 'Land'}`, property.amenities[0] || 'Great Location'] }} />

          {similar && similar.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similar Properties in {property.city}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6 text-center space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Vestra Trust Score</h3>
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-28 h-28 transform -rotate-90 trust-ring" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-gray-200 dark:text-gray-700" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={trustStrokeColor} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - property.trustScore / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${trustColor}`}>{property.trustScore}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">AI-powered score based on document authenticity, ownership history, and market analysis.</p>
            <Link to="/verify" className="text-xs text-emerald-600 hover:underline font-medium">Get full verification report</Link>
          </Card>

          {property.isVerified && (
            <Card className="p-5 space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Verification Checks</h3>
              {['Title Deed Authenticity', 'Ownership Verified', 'Land Rates Cleared', 'No Encumbrances', 'Price Within Market Range'].map((check) => (
                <div key={check} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{check}</span>
                </div>
              ))}
            </Card>
          )}

          {agent && (
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Listed by</h3>
              <div className="flex items-center gap-3">
                <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <Link to={`/agents/${agent.id}`} className="font-medium text-gray-900 dark:text-white hover:text-emerald-600">{agent.name}</Link>
                  <p className="text-xs text-gray-500">{agent.agencyName}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                    <Star size={10} fill="currentColor" /> {agent.rating} ({agent.reviewCount})
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => toast.success(`Calling ${agent.name} at ${agent.phone}...`)}><Phone size={14} /> Call</Button>
                <WhatsAppChat phone={agent.phone} name={agent.name} variant="pill" />
              </div>
            </Card>
          )}

          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-emerald-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Secure Your Purchase</h3>
            </div>
            <p className="text-xs text-gray-500">Pay deposit via M-Pesa into escrow. Funds held securely until title transfer is complete.</p>
            <Button onClick={() => setShowMpesa(true)} size="sm" className="w-full bg-mpesa hover:bg-green-600 border-0">Pay Deposit with M-Pesa</Button>
          </Card>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => toggle(property.id)}>
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-red-500' : ''} /> {saved ? 'Saved' : 'Save to Favorites'}
            </Button>
            <WhatsAppShare property={property} />
            <button onClick={() => toast.success('Report submitted. Our team will investigate this listing within 24 hours.')} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <AlertTriangle size={14} /> Report This Listing
            </button>
          </div>
        </div>
      </div>

      <Modal open={showMpesa} onClose={() => setShowMpesa(false)} title="M-Pesa Deposit">
        <MPesaPayment amount={property.price * 0.1} description={`10% deposit for ${property.title}`} onSuccess={() => { setShowMpesa(false); toast.success('Deposit paid successfully! Escrow is now active.'); }} onCancel={() => setShowMpesa(false)} />
      </Modal>

      <Modal open={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule a Viewing">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">You're scheduling a viewing for <strong>{property.title}</strong>.</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Date</label><input type="date" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Time</label><input type="time" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" /></div>
          </div>
          {agent && <p className="text-xs text-gray-500">Agent {agent.name} will confirm via SMS/WhatsApp.</p>}
          <Button className="w-full" onClick={() => { setShowSchedule(false); toast.success('Viewing request sent! The agent will confirm shortly.'); }}>Confirm Viewing Request</Button>
        </div>
      </Modal>
    </div>
  );
}
