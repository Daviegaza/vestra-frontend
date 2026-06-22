import { useState } from 'react';
import { Search, Upload, CreditCard, FileCheck, Shield, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getPropertyById } from '../../data/properties';

type Step = 'input' | 'upload' | 'pay' | 'result';

export default function Verify() {
  const [step, setStep] = useState<Step>('input');
  const [propertyId, setPropertyId] = useState('');
  const [searchResult, setSearchResult] = useState<ReturnType<typeof getPropertyById>>(undefined);
  const [error, setError] = useState('');

  const handleSearch = () => {
    const found = getPropertyById(propertyId.trim());
    if (found) {
      setSearchResult(found);
      setError('');
    } else {
      setError('Property not found. Try searching by ID (e.g., prop-001)');
      setSearchResult(undefined);
    }
  };

  const steps = [
    { key: 'input', label: 'Find Property', icon: Search },
    { key: 'upload', label: 'Upload Docs', icon: Upload },
    { key: 'pay', label: 'Payment', icon: CreditCard },
    { key: 'result', label: 'Report', icon: FileCheck },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Verify a Property</h1>
        <p className="text-gray-400 mb-8">AI-powered document analysis. Trust scores. Fraud detection. In minutes.</p>
      </div>

      <div className="flex items-center justify-between mb-10">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              step === s.key ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-400'
            }`}>
              <s.icon size={16} />
              <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && <ArrowRight size={16} className="text-gray-300" />}
          </div>
        ))}
      </div>

      {step === 'input' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Search size={48} className="mx-auto text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Enter Property ID</h2>
            <p className="text-sm text-gray-500">You can find the Property ID on any listing page.</p>
          </div>
          <Input
            label="Property ID"
            placeholder="e.g., prop-001"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            error={error}
          />
          <Button onClick={handleSearch} className="w-full" size="lg">Search Property</Button>

          {searchResult && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center gap-4">
              <img src={searchResult.images[0]} alt={searchResult.title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{searchResult.title}</p>
                <p className="text-sm text-gray-500">{searchResult.address}</p>
              </div>
              <Button onClick={() => setStep('upload')}>Continue</Button>
            </div>
          )}
        </div>
      )}

      {step === 'upload' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Upload size={48} className="mx-auto text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Documents</h2>
            <p className="text-sm text-gray-500">Title deed, sale agreement, or any property documents.</p>
          </div>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-500">Drag & drop files here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supports: PDF, JPG, PNG (max 10MB)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('input')} className="flex-1">Back</Button>
            <Button onClick={() => setStep('pay')} className="flex-1">Continue to Payment</Button>
          </div>
        </div>
      )}

      {step === 'pay' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <CreditCard size={48} className="mx-auto text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h2>
            <p className="text-sm text-gray-500">Verification report costs KES 2,500</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Verification Report</span>
            <span className="font-bold text-gray-900 dark:text-white">KES 2,500</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-3 cursor-pointer hover:border-emerald-500">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-emerald-600" />
              <span className="text-sm font-medium">M-Pesa</span>
            </div>
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-3 cursor-pointer">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              <span className="text-sm font-medium">Card Payment</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('upload')} className="flex-1">Back</Button>
            <Button onClick={() => setStep('result')} className="flex-1">Pay KES 2,500</Button>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
              <Shield size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verification Complete</h2>
            <p className="text-sm text-gray-500">Report generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <TrendingUp size={24} className="mx-auto text-emerald-600 mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
              <p className="text-xs text-gray-500">Trust Score</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <Shield size={24} className="mx-auto text-emerald-600 mb-1" />
              <p className="text-2xl font-bold text-emerald-600">PASSED</p>
              <p className="text-xs text-gray-500">Verification Status</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Check Results</h3>
            {[
              { label: 'Title Deed Authenticity', pass: true },
              { label: 'Ownership History', pass: true },
              { label: 'Land Rates Clearance', pass: true },
              { label: 'No Encumbrances', pass: true },
              { label: 'Seller Identity Verified', pass: true },
            ].map((check) => (
              <div key={check.label} className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-emerald-500" />
                <span className="text-gray-700 dark:text-gray-300">{check.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('input')} className="flex-1">Verify Another</Button>
            <Button className="flex-1">Download PDF Report</Button>
          </div>
        </div>
      )}
    </div>
  );
}
