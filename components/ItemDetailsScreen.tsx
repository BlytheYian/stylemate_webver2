import React, { useState } from 'react';
import { ClothingItem } from '../types';
import { ArrowUturnLeftIcon, PencilIcon, TrashIcon } from './Icons';

interface ItemDetailsScreenProps {
  item: ClothingItem;
  onBack: () => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (item: ClothingItem) => void;
}

const ItemDetailsScreen: React.FC<ItemDetailsScreenProps> = ({ item, onBack, onEdit, onDelete }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white" aria-label="返回我的物品">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">物品詳情</h2>
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

            <div className="pt-4 mt-auto flex space-x-4">
                <button 
                  onClick={() => onEdit(item)}
                  className="flex-1 flex items-center justify-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold py-3 px-4 rounded-full transition-colors">
                    <PencilIcon className="w-5 h-5 mr-2" />
                    編輯
                </button>
                <button 
                  onClick={() => onDelete(item)}
                  className="flex-1 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 px-4 rounded-full transition-colors">
                    <TrashIcon className="w-5 h-5 mr-2" />
                    刪除
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsScreen;