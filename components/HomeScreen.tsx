
import React from 'react';
import { Match } from '../types';
import { ChevronRightIcon, TheIcon } from './Icons';

interface HomeScreenProps {
  matches: Match[];
  onStartSwiping: () => void;
  onOpenChat: (match: Match) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ matches, onStartSwiping, onOpenChat }) => {
  return (
    <div className="flex flex-col h-full text-white p-4 pt-0 font-sans">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <TheIcon className="w-24 h-24 text-pink-400 mb-4" />
        <h1 className="text-4xl font-bold mb-2 mt-4 text-white">歡迎來到 Stylemate</h1>
        <p className="text-gray-400 max-w-xs mb-8">透過交換您喜愛的衣物，發現新風格。</p>
        <button
          onClick={onStartSwiping}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105"
        >
          開始滑動
        </button>
      </div>
      
      <div className="flex-shrink-0 pb-4">
        <h2 className="text-xl font-bold mb-4 px-2 text-white">您的配對</h2>
        {matches.length > 0 ? (
          <div className="space-y-3 overflow-y-auto max-h-48 pr-2">
            {matches.map(match => (
              <button key={match.id} onClick={() => onOpenChat(match)} className="w-full flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left focus:outline-none focus:ring-2 focus:ring-pink-500">
                <img src={match.user2.clothingItem.userAvatar} alt={match.user2.clothingItem.userName} className="w-12 h-12 rounded-full mr-4 object-cover"/>
                <div className="flex-grow">
                  <p className="font-semibold text-white">{match.user2.clothingItem.userName}</p>
                  <p className="text-sm text-gray-400">
                    {match.status === 'in-transaction' ? '正在安排取貨...' : `配對了對方的 ${match.user2.clothingItem.category}`}
                  </p>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-gray-500" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-3 bg-white/5 rounded-xl">
            <p className="text-gray-400">還沒有配對。繼續滑動來尋找您的風格吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
