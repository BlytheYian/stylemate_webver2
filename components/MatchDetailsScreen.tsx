import React, { useState } from 'react';
import { Match, ClothingItem } from '../types';
import { ArrowUturnLeftIcon, ChatBubbleLeftRightIcon } from './Icons';

interface MatchDetailsScreenProps {
  match: Match;
  onBack: () => void;
  onOpenChat: (match: Match) => void;
}

const ItemDetailCard = ({ item, userLabel }: { item: ClothingItem, userLabel: string }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    return (
        <div className="flex-1 text-left bg-gray-800 p-4 rounded-2xl flex flex-col">
            <div className="w-full aspect-[3/4] bg-gray-700 rounded-xl mb-3 overflow-hidden">
                 <img src={item.imageUrls[activeImageIndex]} alt={userLabel} className="w-full h-full object-cover"/>
            </div>
           
            {item.imageUrls.length > 1 && (
                <div className="flex space-x-2 mb-3">
                    {item.imageUrls.map((url, index) => (
                        <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-10 h-10 rounded-md overflow-hidden focus:outline-none ${activeImageIndex === index ? 'ring-2 ring-pink-500' : ''}`}>
                             <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <p className="text-white font-bold text-lg">{userLabel}</p>
            <p className="text-sm text-gray-400 mb-1">{item.category} &bull; {item.color}</p>
            <p className="text-sm text-pink-400 font-semibold mb-2">NT$ {item.estimatedPrice}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
                {item.style_tags.map(tag => (
                    <span key={tag} className="bg-white/10 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {tag}
                    </span>
                ))}
            </div>

            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">描述</p>
            <p className="text-sm text-gray-300 flex-grow">{item.description || "未提供描述。"}</p>
        </div>
    );
}


const MatchDetailsScreen: React.FC<MatchDetailsScreenProps> = ({ match, onBack, onOpenChat }) => {
  const myItem = match.user1.clothingItem;
  const theirItem = match.user2.clothingItem;

  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white" aria-label="返回歷史紀錄">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">配對詳情</h2>
      </header>
      
      <div className="flex-grow p-6 flex flex-col justify-between overflow-y-auto">
        <div>
            <p className="text-center text-gray-300 mb-4">您在 {new Date(match.matchedAt).toLocaleDateString('zh-TW')} 與 <span className="font-bold text-white">{theirItem.userName}</span> 配對成功</p>
            <div className="flex justify-around items-stretch space-x-4">
                <ItemDetailCard item={myItem} userLabel="您的物品" />
                <div className="flex items-center">
                    <div className="text-3xl font-bold text-pink-400">&harr;</div>
                </div>
                <ItemDetailCard item={theirItem} userLabel={`${theirItem.userName}的物品`} />
            </div>
        </div>

        <div className="mt-8 flex-shrink-0">
            <button 
                onClick={() => onOpenChat(match)}
                className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105"
            >
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-3" />
                進入聊天室
            </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsScreen;