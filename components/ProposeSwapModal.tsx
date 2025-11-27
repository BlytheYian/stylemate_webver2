import React from 'react';
import { ClothingItem } from '../types';

interface ProposeSwapModalProps {
  proposal: {
    myItem: ClothingItem;
    theirItem: ClothingItem;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const ItemCard = ({ item, userLabel }: { item: ClothingItem, userLabel: string }) => (
    <div className="flex-1">
        <img src={item.imageUrls[0]} alt={userLabel} className="w-full h-40 object-cover rounded-xl shadow-lg"/>
        <p className="text-white mt-2 text-sm">{userLabel}</p>
        <p className="text-xs text-pink-400 font-semibold">NT$ {item.estimatedPrice}</p>
    </div>
);

const ProposeSwapModal: React.FC<ProposeSwapModalProps> = ({ proposal, onConfirm, onCancel }) => {
  const { myItem, theirItem } = proposal;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md text-center shadow-2xl border border-pink-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">確認交換提議</h2>
        <p className="text-gray-400 mb-6">您確定要用您的物品交換 {theirItem.userName} 的物品嗎？</p>
        
        <div className="flex justify-around items-start space-x-4 mb-8">
          <ItemCard item={myItem} userLabel={`您的 ${myItem.category}`} />
          <div className="flex items-center h-40 text-2xl font-bold text-pink-400">&harr;</div>
          <ItemCard item={theirItem} userLabel={`${theirItem.userName}的 ${theirItem.category}`} />
        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onCancel} 
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition-colors"
          >
            取消
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full transition-colors"
          >
            確認交換
          </button>
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

export default ProposeSwapModal;