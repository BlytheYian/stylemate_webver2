
import React from 'react';
import { CheckBadgeIcon } from './Icons';

interface CompleteSwapModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const CompleteSwapModal: React.FC<CompleteSwapModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border border-green-400/30 relative">
        <div className="flex justify-center mb-4">
            <div className="bg-green-400/10 p-3 rounded-full">
                <CheckBadgeIcon className="w-8 h-8 text-green-400" />
            </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-wide">要完成這次交換嗎？</h2>
        <p className="text-gray-400 mb-6 leading-relaxed">將交換標記為完成後，聊天室將被封存，且該配對將從您的列表中移除。此操作無法復原。</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition-colors shadow-md active:scale-95 transform duration-150"
          >
            取消
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full transition-colors shadow-md active:scale-95 transform duration-150"
          >
            確認
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CompleteSwapModal;
