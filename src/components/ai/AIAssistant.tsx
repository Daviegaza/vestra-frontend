import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: string[];
}

const faqs: Record<string, string> = {
  'verification': 'To verify a property, go to the **Verify** page and enter the property ID. Our AI analyzes title deeds, cross-references with land registry data, and generates a trust score (0-100%). A score above **90%** indicates a low-risk property.',
  'buy land': 'Buying land in Kenya requires due diligence:\n\n1. Verify the title deed at **ArdhiSasa**\n2. Conduct a land search at the **Ministry of Lands**\n3. Check for encumbrances\n4. Use Vestra\'s AI verification for document analysis\n5. **Always use escrow** for payments',
  'mpesa': 'Vestra supports **M-Pesa** payments for:\n- Verification reports (KES 2,500)\n- Rent payments\n- Escrow deposits\n\nPayments are processed via **Paybill 522522**. You\'ll receive an STK push on your phone to enter your PIN.',
  'escrow': 'Escrow protects both buyer and seller:\n\n1. Buyer\'s funds are held securely\n2. Title deed transfer is verified\n3. Funds released to seller\n\nVestra\'s escrow fee is only **0.5%** of the transaction amount.',
  'stamp duty': 'In Kenya, stamp duty on property transfers:\n- **4%** in urban areas\n- **2%** in rural areas\n\nFirst-time homebuyers may qualify for reduced rates under the Affordable Housing Programme.',
  'title deed': 'A genuine Kenyan title deed has:\n- Watermark\n- Serial number\n- Land reference number\n- Registrar\'s signature\n\nVestra\'s AI detects forgeries with **98% accuracy** by cross-referencing with the digital land registry.',
  'chama': 'Vestra supports **chama** (investment group) property purchases:\n1. Create a chama on your dashboard\n2. Invite members\n3. Track contributions\n4. Vote on property decisions\n\nEach member\'s share is transparently recorded.',
  'rent': 'Vestra\'s rental management:\n- **Landlords**: Collect rent via M-Pesa, track payments, manage maintenance\n- **Tenants**: Pay rent, view receipts, submit maintenance requests\n\nEverything managed from one dashboard.',
  'agent': 'All agents on Vestra are verified with the **Estate Agents Registration Board (EARB)**. Check an agent\'s:\n- Badge level (Bronze → Platinum)\n- Ratings & reviews\n- Past sales history',
  'commission': 'Standard agent commission in Kenya: **1-3%** of the sale price. On Vestra, commission rates are transparent and visible on each agent\'s profile.',
};

function findAnswer(query: string): { answer: string; suggestions: string[] } {
  const q = query.toLowerCase();
  for (const [key, answer] of Object.entries(faqs)) {
    if (q.includes(key)) return { answer, suggestions: ['Tell me about escrow', 'How do I verify property?', 'M-Pesa payment help'] };
  }
  return {
    answer: 'I can help you with questions about property verification, buying land, M-Pesa payments, escrow, stamp duty, title deeds, chama investments, renting, agents, and commissions in Kenya. What would you like to know? 🏠',
    suggestions: ['How do I verify a property?', 'What is escrow?', 'How do I pay via M-Pesa?', 'How to buy land safely in Kenya?'],
  };
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-emerald-700 dark:text-emerald-300">$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Jambo! 👋 I\'m the Vestra AI Assistant. I can help you with property questions, verification, M-Pesa payments, escrow, and more. How can I help?',
      suggestions: ['Verify a property', 'Escrow explained', 'Pay with M-Pesa', 'Buy land safely'],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

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
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    setTimeout(() => {
      const { answer, suggestions } = findAnswer(text);
      setMessages((prev) => [...prev, { role: 'bot', content: answer, suggestions }]);
      setLoading(false);
    }, 900 + Math.random() * 800);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
            aria-label="Open AI Assistant"
          >
            <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-950 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-kikuyu-700 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Vestra AI</h3>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full badge-pulse" />
                    Online — Property Expert
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.role === 'bot' && (
                      <div className="flex items-center gap-2 px-1">
                        <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <Bot size={10} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Vestra AI</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-md shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <p
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                    </div>
                    {msg.suggestions && i === messages.length - 1 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestions.slice(0, 4).map((s, j) => (
                          <button
                            key={j}
                            onClick={() => handleSuggestion(s)}
                            className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-gray-200 dark:border-gray-700 transition-all hover:border-emerald-200 dark:hover:border-emerald-800"
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
                  <div className="flex items-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything about property in Kenya..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm border-0 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!query.trim()}
                  className="p-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Send size={18} />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Powered by AI &middot; Kenya's smartest property assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
