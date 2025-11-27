import React from 'react';
import { HandThumbDownIcon } from './Icons';

interface RejectRequestModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const RejectRequestModal: React.FC<RejectRequestModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border border-red-500/30">
        <div className="flex justify-center mb-4">
            <div className="bg-red-500/10 p-3 rounded-full">
                <HandThumbDownIcon className="w-8 h-8 text-red-400" />
            </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">拒絕交換請求？</h2>
        <p className="text-gray-400 mb-6">您確定要拒絕這次請求嗎？此操作無法復原。</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onCancel} 
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition-colors"
          >
            取消
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full transition-colors"
          >
            確認拒絕
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

export default RejectRequestModal;