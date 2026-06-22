import { useState } from 'react';
import { Search, Phone, Mail, Send } from 'lucide-react';

import Button from '../components/ui/Button';
import { messages } from '../data/messages';

export default function Messages() {
  const [selected, setSelected] = useState(messages[0]?.id);

  const active = messages.find((m) => m.id === selected);

  return (

      <div className="h-full flex rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg.id)}
                className={`w-full p-3 text-left border-b border-gray-100 dark:border-gray-700/50 transition-colors ${
                  selected === msg.id ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    {msg.senderAvatar ? (
                      <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="text-sm font-bold text-emerald-600">{msg.senderName[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{msg.senderName}</p>
                      <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 truncate">{msg.content.slice(0, 60)}</p>
                  </div>
                  {!msg.read && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {active ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    {active.senderAvatar ? (
                      <img src={active.senderAvatar} alt={active.senderName} className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="text-sm font-bold text-emerald-600">{active.senderName[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{active.senderName}</p>
                    <p className="text-xs text-gray-500">{active.subject}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Phone size={16} /></button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Mail size={16} /></button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="max-w-lg">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{active.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(active.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a reply..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <Button><Send size={16} /> Send</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a conversation</div>
          )}
        </div>
      </div>

  );
}
