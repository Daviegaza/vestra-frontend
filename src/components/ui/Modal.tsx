import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'center' | 'bottom';
}

export default function Modal({ open, onClose, title, children, size = 'md', variant = 'center' }: ModalProps) {
  if (!open) return null;

  const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  if (variant === 'bottom') {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative w-full sm:${sizeClasses[size]} bg-gray-800 rounded-t-2xl sm:rounded-xl shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto`}>
          <div className="flex items-center justify-center pt-2 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-gray-600 rounded-full" />
          </div>
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-700 cursor-pointer" aria-label="Close">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeClasses[size]} bg-gray-800 rounded-xl shadow-xl animate-scale-in`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-700 cursor-pointer" aria-label="Close">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
