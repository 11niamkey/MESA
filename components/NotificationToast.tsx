import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-up pointer-events-none">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 border border-orange-500/50 backdrop-blur-md">
        <div className="bg-green-500 rounded-full p-0.5">
          <CheckCircle className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-sm tracking-wide">{message}</span>
      </div>
    </div>
  );
};
