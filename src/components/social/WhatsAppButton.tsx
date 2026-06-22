import { MessageCircle, Share2 } from 'lucide-react';
import type { Property } from '../../types';

function openWhatsApp(phone: string, message: string) {
  const cleaned = phone.replace(/\D/g, '');
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function shareWhatsApp(text: string, url?: string) {
  const shareText = url ? `${text}\n${url}` : text;
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
}

interface WhatsAppChatProps {
  phone: string;
  name: string;
  message?: string;
  variant?: 'button' | 'icon' | 'pill';
  size?: 'sm' | 'md' | 'lg';
}

export function WhatsAppChat({ phone, name, message, variant = 'button', size = 'md' }: WhatsAppChatProps) {
  const defaultMessage = message || `Hi ${name}, I'm interested in your property listing on Vestra. Is it still available?`;
  const sizeClasses = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

  if (variant === 'icon') {
    return (
      <button
        onClick={() => openWhatsApp(phone, defaultMessage)}
        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={size === 'sm' ? 16 : 20} fill="currentColor" />
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={() => openWhatsApp(phone, defaultMessage)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
      >
        <MessageCircle size={14} fill="currentColor" /> WhatsApp
      </button>
    );
  }

  return (
    <button
      onClick={() => openWhatsApp(phone, defaultMessage)}
      className={`inline-flex items-center gap-2 bg-whatsapp hover:bg-green-600 text-white rounded-lg font-medium transition-colors ${sizeClasses[size]}`}
    >
      <MessageCircle size={size === 'sm' ? 14 : 18} fill="currentColor" />
      Chat on WhatsApp
    </button>
  );
}

interface WhatsAppShareProps {
  property: Property;
  variant?: 'button' | 'icon';
}

export function WhatsAppShare({ property, variant = 'button' }: WhatsAppShareProps) {
  const text = `Check out this property on Vestra: ${property.title}\n${property.city}, ${property.county}\nKES ${property.price.toLocaleString('en-KE')}${property.listingType === 'rent' ? '/mo' : ''}`;

  if (variant === 'icon') {
    return (
      <button
        onClick={() => shareWhatsApp(text, window.location.href)}
        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        title="Share on WhatsApp"
      >
        <Share2 size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={() => shareWhatsApp(text, window.location.href)}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
    >
      <MessageCircle size={16} fill="currentColor" /> Share via WhatsApp
    </button>
  );
}

interface WhatsAppQuickRepliesProps {
  phone: string;
  name: string;
}

export function WhatsAppQuickReplies({ phone, name }: WhatsAppQuickRepliesProps) {
  const templates = [
    `Hi ${name}, is this property still available?`,
    `Hi ${name}, can I schedule a viewing?`,
    `Hi ${name}, is the price negotiable?`,
    `Hi ${name}, what are the payment terms?`,
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Reply via WhatsApp</p>
      {templates.map((t, i) => (
        <button
          key={i}
          onClick={() => openWhatsApp(phone, t)}
          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default WhatsAppChat;
