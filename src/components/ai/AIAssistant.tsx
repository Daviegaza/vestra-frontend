import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: string[];
}

const faqs: Record<string, string> = {
  'verification': 'To verify a property, go to the **Verify** page and enter the property ID. Our AI will analyze the title deed, cross-reference with land registry data, and generate a trust score (0-100%). A score above 90% indicates a low-risk property.',
  'buy land': 'Buying land in Kenya requires due diligence: 1) Verify the title deed at ArdhiSasa, 2) Conduct a land search at the Ministry of Lands, 3) Check for encumbrances, 4) Use Vestra\'s verification service for AI-powered document analysis. Always use escrow for payments.',
  'mpesa': 'Vestra supports M-Pesa payments for verification reports (KES 2,500), rent payments, and escrow deposits. Payments are processed via Paybill 522522. You\'ll receive an STK push on your phone to enter your PIN.',
  'escrow': 'Escrow protects both buyer and seller. The buyer\'s funds are held securely until all conditions are met. Once the title deed transfer is confirmed, funds are released to the seller. Vestra\'s escrow fee is 0.5% of the transaction amount.',
  'stamp duty': 'In Kenya, stamp duty on property transfers is 4% of the property value in urban areas and 2% in rural areas. First-time homebuyers may qualify for reduced rates under the Affordable Housing Programme.',
  'title deed': 'A genuine Kenyan title deed has specific security features: watermark, serial number, land reference number, and the Registrar\'s signature. Vestra\'s AI verification can detect forged documents with 98% accuracy by cross-referencing with digital land registry data.',
  'chama': 'Vestra supports chama (investment group) property purchases. Create a chama on your dashboard, invite members, track contributions, and vote on property decisions. Each member\'s share is transparently recorded.',
  'rent': 'Vestra\'s rental management lets landlords collect rent via M-Pesa, track payments, manage maintenance requests, and generate receipts. Tenants can pay rent, view receipts, and submit maintenance requests all from their dashboard.',
  'agent': 'All agents on Vestra are verified with the Estate Agents Registration Board (EARB). Check an agent\'s badge level (Bronze, Silver, Gold, Platinum), ratings, and past sales before engaging them.',
  'commission': 'Standard agent commission in Kenya is 1-3% of the sale price, negotiable between buyer and agent. On Vestra, commission rates are transparent and visible on each agent\'s profile.',
};

function findAnswer(query: string): { answer: string; suggestions: string[] } {
  const q = query.toLowerCase();
  for (const [key, answer] of Object.entries(faqs)) {
    if (q.includes(key)) return { answer, suggestions: ['Tell me about escrow', 'How do I verify property?', 'M-Pesa payment help'] };
  }
  return {
    answer: 'I can help you with questions about property verification, buying land, M-Pesa payments, escrow, stamp duty, title deeds, chama investments, renting, agents, and commissions in Kenya. What would you like to know?',
    suggestions: ['How do I verify a property?', 'What is escrow?', 'How do I pay via M-Pesa?', 'How to buy land safely in Kenya?'],
  };
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Jambo! 👋 I\'m the Vestra AI Assistant. I can help you with property questions, verification, M-Pesa payments, escrow, and more. How can I help?', suggestions: ['Verify a property', 'Escrow explained', 'Pay with M-Pesa', 'Buy land safely'] },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!query.trim()) return;
    const userMsg: Message = { role: 'user', content: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    setTimeout(() => {
      const { answer, suggestions } = findAnswer(userMsg.content);
      setMessages((prev) => [...prev, { role: 'bot', content: answer, suggestions }]);
      setLoading(false);
    }, 800 + Math.random() * 1200);
  };

  const handleSuggestion = (text: string) => {
    setQuery(text);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-110 flex items-center justify-center animate-fade-in-up"
        >
          <Sparkles size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-kikuyu-600 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <h3 className="font-semibold text-sm">Ask Vestra AI</h3>
                <p className="text-xs text-emerald-100">Property assistant for Kenya</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.suggestions && i === messages.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.slice(0, 3).map((s, j) => (
                        <button
                          key={j}
                          onClick={() => handleSuggestion(s)}
                          className="px-2.5 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about property in Kenya..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm border-0 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!query.trim()}
                className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
