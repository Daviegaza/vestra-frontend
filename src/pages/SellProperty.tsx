import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { createProperty } from '../services/properties';
import { toast } from '../store/toastStore';

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Land', 'Agricultural', 'Industrial', 'Short Stay'];
const LISTING_TYPES = ['For Sale', 'For Rent', 'For Lease'];
const COMMON_AMENITIES = ['Parking', 'Security', 'CCTV', 'Garden', 'Swimming Pool', 'Gym', 'Balcony', 'Backup Generator', 'Solar Panels', 'Borehole', 'Electric Fence', 'Fibre Internet', 'Servant Quarter', 'Air Conditioning'];
const KENYA_COUNTIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Machakos', 'Kajiado', 'Kilifi', 'Kwale', 'Nyeri', 'Meru', 'Laikipia'];

export default function SellProperty() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    propertyType: 'Residential',
    listingType: 'For Sale',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sizeSqft: '',
    yearBuilt: '',
    address: '',
    city: '',
    county: 'Nairobi',
    amenities: [] as string[],
  });

  const update = (field: string, value: string | string[]) => setForm((f) => ({ ...f, [field]: value }));
  const toggleAmenity = (a: string) => {
    const next = form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a];
    update('amenities', next);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.city) { toast.error('Please fill in title, price, and city.'); return; }
    setLoading(true);
    try {
      await createProperty({
        title: form.title,
        description: form.description,
        propertyType: form.propertyType.toLowerCase().replace(' ', '_') as any,
        listingType: form.listingType === 'For Sale' ? 'sale' : form.listingType === 'For Rent' ? 'rent' : 'lease',
        price: Number(form.price),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        sizeSqft: Number(form.sizeSqft) || 0,
        yearBuilt: Number(form.yearBuilt) || 0,
        address: form.address,
        city: form.city,
        county: form.county,
        amenities: form.amenities,
        ownerId: user?.id,
        agentId: undefined, // No agent — direct owner sale
      });
      toast.success('Property listed successfully! 🎉');
      navigate('/market');
    } catch {
      toast.error('Failed to list property. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return form.title && form.propertyType && form.listingType;
    if (step === 2) return form.price && form.city && form.county;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/market" className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 mb-6">
        <ArrowLeft size={16} /> Back to Market
      </Link>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <Home size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-white">Sell Your Property</h1>
        <p className="text-gray-400 mt-2">List directly. No agent needed. No commissions.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {step > s ? <CheckCircle size={16} /> : s}
            </div>
            <div className={`flex-1 h-1 rounded-full ${step > s ? 'bg-emerald-600' : 'bg-gray-700'}`} />
          </div>
        ))}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'}`}>3</div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card className="p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Basic Information</h2>
          <Input label="Property Title *" placeholder='e.g., "Spacious 3BR Villa in Karen"' value={form.title} onChange={(e) => update('title', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea rows={4} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="Describe your property. What makes it special?" value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Property Type</label>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => update('propertyType', t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${form.propertyType === t ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Listing Type</label>
              <div className="space-y-2">
                {LISTING_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => update('listingType', t)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${form.listingType === t ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Location & Price */}
      {step === 2 && (
        <Card className="p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Location & Price</h2>
          <Input label="Price (KES) *" type="number" placeholder="e.g., 15000000" value={form.price} onChange={(e) => update('price', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City *" placeholder="e.g., Nairobi" value={form.city} onChange={(e) => update('city', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">County</label>
              <select value={form.county} onChange={(e) => update('county', e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white">
                {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Address" placeholder="Street/estate name" value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Bedrooms" type="number" placeholder="0" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} />
            <Input label="Bathrooms" type="number" placeholder="0" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} />
            <Input label="Size (sqft)" type="number" placeholder="0" value={form.sizeSqft} onChange={(e) => update('sizeSqft', e.target.value)} />
            <Input label="Year Built" type="number" placeholder="2020" value={form.yearBuilt} onChange={(e) => update('yearBuilt', e.target.value)} />
          </div>
        </Card>
      )}

      {/* Step 3: Amenities & Submit */}
      {step === 3 && (
        <Card className="p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Amenities & Finish</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select amenities</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.amenities.includes(a) ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'}`}>
                  {form.amenities.includes(a) ? `✓ ${a}` : a}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-900 rounded-xl space-y-2 text-sm">
            <h3 className="font-semibold text-white mb-2">Listing Summary</h3>
            <div className="flex justify-between"><span className="text-gray-400">Title</span><span className="text-white font-medium">{form.title || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="text-white">{form.propertyType} · {form.listingType}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Price</span><span className="text-emerald-400 font-bold">KES {Number(form.price).toLocaleString() || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="text-white">{form.city || '—'}, {form.county}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Details</span><span className="text-white">{form.bedrooms || 0} bed · {form.bathrooms || 0} bath · {form.sizeSqft || 0} sqft</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Amenities</span><span className="text-white">{form.amenities.length > 0 ? form.amenities.join(', ') : 'None selected'}</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-700"><span className="text-gray-400">Listed by</span><span className="text-emerald-400 font-medium">Owner (Direct Sale)</span></div>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4 flex items-start gap-3">
            <Shield size={20} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-400">Owner Listing</p>
              <p className="text-xs text-gray-400 mt-1">Your property will be listed directly under your name. Buyers contact you directly. No agent commissions. Optional verification available for KES 2,500 to boost buyer trust.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>
        )}
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!isStepValid()} className="flex-1">Continue</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? 'Listing...' : 'Publish Listing'}
          </Button>
        )}
      </div>
    </div>
  );
}
