
import { X, Info } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
  // Auto-dismiss logic
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
        <div className="bg-primary/20 p-2 rounded-full">
            <Info className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
            <p className="font-medium text-sm">{message}</p>
        </div>
        <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};