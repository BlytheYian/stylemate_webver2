import React from 'react';
import { ClothingItem } from '../types';
import ClothingCard from './ClothingCard';
import { HeartIcon, XMarkIcon, SparklesIcon, ArrowUturnLeftIcon } from './Icons';

interface SwipingScreenProps {
  deck: ClothingItem[];
  activeCardIndex: number;
  swipedDirection: 'left' | 'right' | null;
  handleSwipe: (direction: 'left' | 'right') => void;
  onNoMoreCardsUpload: () => void;
}

const SwipingScreen: React.FC<SwipingScreenProps> = ({ deck, activeCardIndex, swipedDirection, handleSwipe, onNoMoreCardsUpload }) => {

  const NoMoreCards = () => (
    <div className="flex flex-col items-center justify-center text-center text-white h-full">
        <SparklesIcon className="w-24 h-24 text-pink-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">全部看完了！</h2>
        <p className="text-gray-400 max-w-xs">您已經看完了目前所有的風格。稍後再來看看，或上傳您自己的物品以獲得更多配對。</p>
        <button
            onClick={onNoMoreCardsUpload}
            className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
        >
            上傳您的風格
        </button>
    </div>
  );

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 relative h-full">
        <div className="w-full max-w-sm h-[70vh] relative">
            {activeCardIndex >= deck.length ? (
            <NoMoreCards />
            ) : (
            <>
                {deck.slice(activeCardIndex, activeCardIndex + 3).reverse().map((item, index) => {
                const isTopCard = index === (deck.slice(activeCardIndex, activeCardIndex + 3).length - 1);
                return (
                    <ClothingCard
                    key={item.id}
                    item={item}
                    isTopCard={isTopCard}
                    swipeDirection={isTopCard ? swipedDirection : null}
                    style={{
                        transform: `translateY(${-index * 12}px) scale(${1 - index * 0.05})`,
                        zIndex: 10 - index,
                    }}
                    />
                );
                })}
            </>
            )}
        </div>
        
        {activeCardIndex < deck.length && (
            <div className="flex items-center justify-center space-x-8 mt-6">
            <button 
                onClick={() => handleSwipe('left')}
                className="bg-white/10 p-5 rounded-full text-white backdrop-blur-sm shadow-lg transform transition-transform hover:scale-110 active:scale-95"
                aria-label="跳過"
            >
                <XMarkIcon className="w-8 h-8 text-red-400" />
            </button>
            <button 
                onClick={() => handleSwipe('right')}
                className="bg-white/10 p-5 rounded-full text-white backdrop-blur-sm shadow-lg transform transition-transform hover:scale-110 active:scale-95"
                aria-label="喜歡"
            >
                <HeartIcon className="w-8 h-8 text-pink-400" />
            </button>
            </div>
        )}
    </div>
  );
};

export default SwipingScreen;