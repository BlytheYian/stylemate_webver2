
import React from 'react';
import { ClothingItem } from '../types';

interface ClothingCardProps {
  item: ClothingItem;
  isTopCard: boolean;
  swipeDirection: 'left' | 'right' | null;
  style?: React.CSSProperties;
}

const swipeAnimationClasses = {
  left: 'animate-swipe-out-left',
  right: 'animate-swipe-out-right',
};

const ClothingCard: React.FC<ClothingCardProps> = ({ item, isTopCard, swipeDirection, style }) => {
  const animationClass = swipeDirection ? swipeAnimationClasses[swipeDirection] : '';

  return (
    <div
      className={`absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-800 transition-transform duration-300 ease-in-out ${animationClass}`}
      style={style}
    >
      <img src={item.imageUrls[0]} alt={`${item.category} from ${item.userName}`} className="w-full h-full object-cover" />
      
      {/* Gradient Overlay matching LinearGradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

      {/* Info Container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* User Container */}
        <div className="flex items-center mb-2">
            <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full mr-3 border-2 border-pink-400 object-cover"/>
            <div>
              <p className="font-bold text-lg leading-tight">{item.userName}</p>
              <p className="text-xs text-gray-300 mt-0.5">預估價值: NT$ {item.estimatedPrice}</p>
            </div>
        </div>
        
        {/* Tags Container */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">{item.category}</span>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">{item.color}</span>
          {item.style_tags.map(tag => (
            <span key={tag} className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Swipe Labels matching React Native styles */}
      {isTopCard && swipeDirection === 'left' && (
        <div className="absolute top-1/4 left-8 transform -rotate-12 opacity-80 border-4 border-red-500 rounded-lg px-6 py-2">
            <h2 className="text-5xl font-bold text-red-500 whitespace-nowrap">跳過</h2>
        </div>
      )}
      {isTopCard && swipeDirection === 'right' && (
        <div className="absolute top-1/4 right-8 transform rotate-12 opacity-80 border-4 border-pink-400 rounded-lg px-6 py-2">
            <h2 className="text-5xl font-bold text-pink-400 whitespace-nowrap">喜歡</h2>
        </div>
      )}

      <style>{`
        @keyframes swipe-out-left {
          0% { transform: translateX(0) rotate(0); opacity: 1; }
          100% { transform: translateX(-100vw) rotate(-30deg); opacity: 0; }
        }
        .animate-swipe-out-left {
          animation: swipe-out-left 0.5s ease-out forwards;
        }
        @keyframes swipe-out-right {
          0% { transform: translateX(0) rotate(0); opacity: 1; }
          100% { transform: translateX(100vw) rotate(30deg); opacity: 0; }
        }
        .animate-swipe-out-right {
          animation: swipe-out-right 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ClothingCard;
