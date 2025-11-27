
import React from 'react';
import { Match, ClothingItem } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface HistoryScreenProps {
  matches: Match[];
  onBack: () => void;
  onMatchClick: (match: Match) => void;
}

const statusLabels: { [key in Match['status']]: string } = {
  active: '可聊天',
  'in-transaction': '交易中',
  completed: '已完成',
  cancelled: '已取消',
};

const statusStyles: { [key in Match['status']]: { text: string; bg: string; } } = {
  active: { text: 'text-pink-400', bg: 'bg-pink-500/20' },
  'in-transaction': { text: 'text-blue-400', bg: 'bg-blue-500/20' },
  completed: { text: 'text-green-400', bg: 'bg-green-500/20' },
  cancelled: { text: 'text-gray-400', bg: 'bg-gray-600/20' },
};

const ItemCard = ({ item, userLabel }: { item: ClothingItem, userLabel: string }) => (
    <div className="flex-1 bg-gray-800/50 p-3 rounded-lg flex flex-col">
        <img src={item.imageUrls[0]} alt={userLabel} className="w-full h-32 object-cover rounded-md mb-2" />
        <p className="text-white font-bold text-sm truncate">{userLabel}</p>
        <p className="text-xs text-gray-400 mb-1 truncate">{item.category} &bull; {item.color}</p>
        <p className="text-xs text-gray-300 font-bold">NT$ {item.estimatedPrice}</p>
    </div>
);

const HistoryScreen: React.FC<HistoryScreenProps> = ({ matches, onBack, onMatchClick }) => {
  const sortedMatches = [...matches].sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());
  
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white font-sans">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white hover:text-gray-300 transition-colors" aria-label="返回">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">配對歷史</h2>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto">
        {sortedMatches.length > 0 ? (
          <div className="space-y-4">
            {sortedMatches.map(match => (
              <button 
                key={match.id} 
                onClick={() => onMatchClick(match)}
                className="w-full flex flex-col p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-300">與 <span className="font-bold text-white">{match.user2.clothingItem.userName}</span> 配對成功</p>
                   <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[match.status].bg} ${statusStyles[match.status].text}`}>
                    {statusLabels[match.status]}
                  </span>
                </div>
                
                <div className="border-t border-white/10 my-2"></div>

                 <div className="flex justify-around items-stretch space-x-3 my-3">
                    <ItemCard item={match.user1.clothingItem} userLabel={`您的 ${match.user1.clothingItem.category}`} />
                    <div className="flex items-center text-xl font-bold text-pink-400 px-2">&harr;</div>
                    <ItemCard item={match.user2.clothingItem} userLabel={`${match.user2.clothingItem.userName}的 ${match.user2.clothingItem.category}`} />
                </div>

                <div className="border-t border-white/10 my-2"></div>
                
                <div className="mt-2 text-xs text-gray-400 space-y-1">
                    <p>配對於: {new Date(match.matchedAt).toLocaleString('zh-TW')}</p>
                    {match.completedAt && <p>完成於: {new Date(match.completedAt).toLocaleString('zh-TW')}</p>}
                </div>

              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>您的配對歷史為空。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
