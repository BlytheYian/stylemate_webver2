
import React from 'react';
import { Match } from '../types';
import { SparklesIcon } from './Icons';

interface MatchModalProps {
  match: Match;
  onClose: () => void;
  onStartChat: (match: Match) => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ match, onClose, onStartChat }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl p-6 md:p-8 w-11/12 max-w-md text-center relative shadow-2xl border border-pink-500/30">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <SparklesIcon className="w-24 h-24 text-pink-400 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mt-10 mb-4">配對成功！</h2>
        <p className="text-gray-300 mb-6">您和 {match.user2.clothingItem.userName} 都喜歡對方的物品。</p>
        
        <div className="flex justify-around items-center space-x-4 mb-8">
          <div className="flex-1">
            <img src={match.user1.clothingItem.imageUrls[0]} alt="Your item" className="w-full h-40 object-cover rounded-xl shadow-lg"/>
            <p className="text-white mt-2 text-sm">您的 {match.user1.clothingItem.category}</p>
          </div>
          <div className="text-2xl font-bold text-pink-400">&harr;</div>
          <div className="flex-1">
            <img src={match.user2.clothingItem.imageUrls[0]} alt="Their item" className="w-full h-40 object-cover rounded-xl shadow-lg"/>
            <p className="text-white mt-2 text-sm">{match.user2.clothingItem.userName}的 {match.user2.clothingItem.category}</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
            <button 
                onClick={() => onStartChat(match)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105"
            >
                傳送訊息
            </button>
            <button onClick={onClose} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition-colors">
                繼續滑動
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MatchModal;