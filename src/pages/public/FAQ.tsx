import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    category: 'General',
    items: [
      { q: 'What is Vestra?', a: 'Vestra is an AI-powered property trust platform that helps Kenyans find, verify, and transact real estate with confidence. We combine document analysis, blockchain title tracking, and market intelligence.' },
      { q: 'How much does it cost?', a: 'Browsing properties is free. Verification reports cost KES 2,500 per property. Subscription plans are available for agents and landlords starting at KES 1,000/month.' },
      { q: 'Is Vestra available across Kenya?', a: 'Yes! We serve all 47 counties with verified properties and agents across the country.' },
    ],
  },
  {
    category: 'Verification',
    items: [
      { q: 'How does property verification work?', a: 'Our AI analyzes title deeds, searches land records, checks for encumbrances, and cross-references ownership history to generate a trust score (0-100%).' },
      { q: 'How long does verification take?', a: 'Basic verification takes 24-48 hours. Premium deep verification with blockchain title tracing can take up to 5 business days.' },
      { q: 'What does the trust score mean?', a: 'A trust score above 90% indicates a low-risk property. Scores between 70-90% may need additional scrutiny. Scores below 70% are flagged for potential issues.' },
    ],
  },
  {
    category: 'Payments & Security',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, Airtel Money, bank transfers, and credit/debit cards. Escrow services are available for large transactions.' },
      { q: 'How does escrow work?', a: 'Our escrow service holds buyer funds securely until all transaction conditions are met. Funds are only released when both parties confirm satisfaction.' },
      { q: 'Is my data safe?', a: 'Yes. We use bank-grade encryption, comply with Kenya\'s Data Protection Act, and never share your personal information without consent.' },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Find answers to common questions about Vestra.</p>

      <div className="space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map((item) => {
                const idx = `${section.category}-${item.q}`;
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="font-medium text-gray-900 dark:text-white pr-4">{item.q}</span>
                      {isOpen ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
