import React, { useState } from 'react';
import { LikedItem } from '../types';
import { ArrowUturnLeftIcon, TrashIcon } from './Icons';

interface LikedItemDetailsScreenProps {
  likedItem: LikedItem;
  onBack: () => void;
  onRemove: (likedItemId: string) => void;
}

const statusStyles: { [key in LikedItem['status']]: { text: string; bg: string; border: string; label: string; description: string; } } = {
  pending: { text: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-400/30', label: '等待中', description: "對方還沒看到您的喜歡。" },
  matched: { text: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-400/30', label: '配對成功！', description: "你們都喜歡對方的物品。快去完成交換吧！" },
  rejected: { text: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-400/30', label: '已拒絕', description: "對方這次選擇跳過了。" },
};

const LikedItemDetailsScreen: React.FC<LikedItemDetailsScreenProps> = ({ likedItem, onBack, onRemove }) => {
  const item = likedItem.item;
  const statusInfo = statusStyles[likedItem.status];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white" aria-label="返回喜愛的物品列表">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">喜愛的物品詳情</h2>
      </header>

      <div className="flex-grow flex flex-col md:flex-row gap-8 p-4 md:p-6 overflow-y-auto">
        {/* Left Column: Image Viewer */}
        <div className="w-full md:w-2/5">
          <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden mb-2">
            <img src={item.imageUrls[activeImageIndex]} alt={`${item.category} - ${activeImageIndex + 1}`} className="w-full h-full object-cover"/>
          </div>
          {item.imageUrls.length > 1 && (
             <div className="flex space-x-2">
                {item.imageUrls.map((url, index) => (
                    <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-16 h-16 rounded-md overflow-hidden focus:outline-none ${activeImageIndex === index ? 'ring-2 ring-pink-500' : 'opacity-60 hover:opacity-100'}`}>
                        <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
          )}
        </div>
        
        {/* Right Column: Details & Actions */}
        <div className="w-full md:w-3/5 flex flex-col">
            <div className="space-y-3 flex-grow">
                <div className={`p-3 rounded-xl border ${statusInfo.bg} ${statusInfo.border}`}>
                    <h3 className={`font-bold text-md ${statusInfo.text}`}>{statusInfo.label}</h3>
                    <p className="text-sm text-gray-300">{statusInfo.description}</p>
                </div>

                <div className="flex items-center">
                    <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full mr-3 border-2 border-purple-400"/>
                    <p className="font-bold text-lg">{item.userName}</p>
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{item.category}</h1>
                    <p className="text-md text-gray-400">{item.color}</p>
                    <p className="text-lg text-pink-400 font-semibold mt-1">NT$ {item.estimatedPrice}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {item.style_tags.map(tag => (
                        <span key={tag} className="bg-white/10 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        {tag}
                        </span>
                    ))}
                </div>
                
                <div>
                    <h3 className="font-bold text-md mb-1">描述</h3>
                    <p className="text-gray-300 text-sm">{item.description || "未提供描述。"}</p>
                </div>
            </div>

            {(likedItem.status === 'pending' || likedItem.status === 'rejected') && (
              <div className="pt-4 mt-auto">
                  <button 
                      onClick={() => onRemove(likedItem.id)}
                      className="w-full flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 px-4 rounded-full transition-colors">
                      <TrashIcon className="w-5 h-5 mr-2" />
                      從喜愛中移除
                  </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LikedItemDetailsScreen;