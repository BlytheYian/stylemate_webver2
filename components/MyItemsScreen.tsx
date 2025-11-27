

import React from 'react';
import { ClothingItem } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface MyItemsScreenProps {
  items: ClothingItem[];
  onBack: () => void;
  onItemClick: (item: ClothingItem) => void;
}

const MyItemsScreen: React.FC<MyItemsScreenProps> = ({ items, onBack, onItemClick }) => {
  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white" aria-label="返回主頁">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">我的物品 ({items.length})</h2>
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {items.map(item => (
                    <button key={item.id} onClick={() => onItemClick(item)} className="relative rounded-lg overflow-hidden aspect-[3/4] group text-left focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                        <img src={item.imageUrls[0]} alt={item.category} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all"></div>
                        <div className="absolute bottom-0 left-0 p-2">
                            <h3 className="text-white font-semibold text-sm">{item.category}</h3>
                        </div>
                    </button>
                ))}
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>您還沒有上傳任何物品。</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyItemsScreen;