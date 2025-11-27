
import React from 'react';
import { ExclamationTriangleIcon } from './Icons';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border border-red-500/30">
        <div className="flex justify-center mb-4">
            <div className="bg-red-500/10 p-3 rounded-full">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
            </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">確認登出</h2>
        <p className="text-gray-400 mb-6">您確定要登出您的帳戶嗎？</p>
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
            登出
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

export default LogoutModal;