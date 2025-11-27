import React from 'react';
import { LikedItem } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface LikedItemsScreenProps {
  likedItems: LikedItem[];
  onBack: () => void;
  onItemClick: (item: LikedItem) => void;
}

const statusLabels: { [key in LikedItem['status']]: string } = {
  pending: '等待中',
  matched: '已配對',
  rejected: '已拒絕',
};

const statusStyles: { [key in LikedItem['status']]: { text: string; bg: string; } } = {
  pending: { text: 'text-yellow-300', bg: 'bg-yellow-500/20' },
  matched: { text: 'text-pink-400', bg: 'bg-pink-500/20' },
  rejected: { text: 'text-gray-400', bg: 'bg-gray-500/20' },
};

const LikedItemsScreen: React.FC<LikedItemsScreenProps> = ({ likedItems, onBack, onItemClick }) => {
  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white" aria-label="返回主頁">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">喜愛的物品</h2>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto">
        {likedItems.length > 0 ? (
          <div className="space-y-3">
            {likedItems.map(likedItem => (
              <button 
                key={likedItem.id} 
                onClick={() => onItemClick(likedItem)}
                className="w-full flex items-center p-3 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <img src={likedItem.item.imageUrls[0]} alt={likedItem.item.category} className="w-16 h-20 object-cover rounded-md mr-4"/>
                <div className="flex-grow">
                  <p className="font-semibold">{likedItem.item.category} 來自 {likedItem.item.userName}</p>
                  <p className="text-sm text-gray-400">{likedItem.item.color}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[likedItem.status].bg} ${statusStyles[likedItem.status].text}`}>
                  {statusLabels[likedItem.status]}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>您還沒有喜歡任何物品。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedItemsScreen;