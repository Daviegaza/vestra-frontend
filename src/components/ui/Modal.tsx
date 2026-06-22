import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'center' | 'bottom';
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ open, onClose, title, children, size = 'md', variant = 'center' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {variant === 'bottom' ? (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full sm:${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col`}
            >
              <div className="flex items-center justify-center pt-2 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors" aria-label="Close">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
              )}
              <div className="px-6 py-4 overflow-y-auto">{children}</div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col`}
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors" aria-label="Close">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
              )}
              <div className="px-6 py-4 overflow-y-auto">{children}</div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
