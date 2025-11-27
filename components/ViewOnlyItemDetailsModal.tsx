import React, { useState } from 'react';
import { ClothingItem } from '../types';
import { XMarkIcon } from './Icons';

interface ViewOnlyItemDetailsModalProps {
  item: ClothingItem;
  onClose: () => void;
}

const ViewOnlyItemDetailsModal: React.FC<ViewOnlyItemDetailsModalProps> = ({ item, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl w-full max-w-4xl text-white shadow-2xl border border-purple-500/30 relative flex flex-col max-h-[90vh]">
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center">
            <img src={item.userAvatar} alt={item.userName} className="w-8 h-8 rounded-full mr-3"/>
            <h2 className="text-xl font-bold">{item.userName} 的物品</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto flex flex-col md:flex-row">
          {/* Left: Image Viewer */}
          <div className="w-full md:w-2/5 p-4">
            <div className="w-full aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden mb-2">
                <img src={item.imageUrls[activeImageIndex]} alt={item.category} className="w-full h-full object-cover"/>
            </div>
            {item.imageUrls.length > 1 && (
                <div className="flex space-x-2">
                    {item.imageUrls.map((url, index) => (
                        <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-16 h-20 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-pink-500 ${activeImageIndex === index ? 'ring-2 ring-pink-500' : 'opacity-60 hover:opacity-100'}`}>
                            <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>
          
          {/* Right: Details */}
          <div className="w-full md:w-3/5 p-6 space-y-4">
            <div>
                <h1 className="text-3xl font-bold">{item.category}</h1>
                <p className="text-lg text-gray-400">{item.color}</p>
                <p className="text-xl text-pink-400 font-semibold mt-1">NT$ {item.estimatedPrice}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {item.style_tags.map(tag => (
                    <span key={tag} className="bg-white/10 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {tag}
                    </span>
                ))}
            </div>
            
            <div>
                <h3 className="font-bold text-lg mb-2">描述</h3>
                <p className="text-gray-300">{item.description || "未提供描述。"}</p>
            </div>
          </div>
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

export default ViewOnlyItemDetailsModal;