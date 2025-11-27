import React from 'react';
import { Request, ClothingItem } from '../types';
import { ArrowUturnLeftIcon, HandThumbDownIcon } from './Icons';

interface RequestDetailsScreenProps {
  request: Request;
  onBack: () => void;
  onProposeSwap: (requesterItem: ClothingItem) => void;
  onReject: () => void;
  onViewItemDetails: (item: ClothingItem) => void;
}

// FIX: Define an interface for ItemCard props to avoid issues with React's special 'key' prop.
interface ItemCardProps {
    item: ClothingItem;
    onProposeSwap: (item: ClothingItem) => void;
    onViewDetails: (item: ClothingItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onProposeSwap, onViewDetails }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col text-left">
        <button onClick={() => onViewDetails(item)} className="w-full h-48 block">
            <img src={item.imageUrls[0]} alt={item.category} className="w-full h-full object-cover"/>
        </button>
        <div className="p-3 flex flex-col flex-grow">
            <h4 className="font-bold text-white">{item.category}</h4>
            <p className="text-sm text-gray-400 mb-1">{item.color}</p>
            <p className="text-sm text-pink-400 font-semibold mb-2">NT$ {item.estimatedPrice}</p>
             <p className="text-xs text-gray-400 flex-grow mb-3">{item.description ? `${item.description.substring(0, 30)}...` : "未提供描述。"}</p>
            <button
                onClick={() => onProposeSwap(item)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold py-2 px-3 rounded-md transition-colors mt-auto"
            >
                提議交換
            </button>
        </div>
    </div>
);


const RequestDetailsScreen: React.FC<RequestDetailsScreenProps> = ({ request, onBack, onProposeSwap, onReject, onViewItemDetails }) => {

  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center">
            <button onClick={onBack} className="mr-4 text-white" aria-label="返回請求列表">
            <ArrowUturnLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-xl">回應請求</h2>
        </div>
        <button 
            onClick={onReject}
            className="flex items-center text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-full"
        >
            <HandThumbDownIcon className="w-5 h-5 mr-2" />
            拒絕
        </button>
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        {/* Top section: Their interest */}
        <div className="bg-gray-800 p-4 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-2 text-pink-400">{request.requester.name} 喜歡您的...</h3>
          <div className="flex items-center bg-white/5 p-3 rounded-lg">
            <img src={request.itemOfInterest.imageUrls[0]} alt={request.itemOfInterest.category} className="w-20 h-24 object-cover rounded-md mr-4" />
            <div>
              <p className="font-bold text-lg">{request.itemOfInterest.category}</p>
              <p className="text-sm text-gray-400">{request.itemOfInterest.color}</p>
              <p className="text-md text-pink-400 font-semibold mt-1">NT$ {request.itemOfInterest.estimatedPrice}</p>
            </div>
          </div>
        </div>
        
        {/* Bottom section: Their closet */}
        <div>
          <h3 className="text-lg font-semibold mb-2">選擇對方的一件物品來交換：</h3>
          {request.requester.closet.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                  {request.requester.closet.map(item => (
                      <ItemCard key={item.id} item={item} onProposeSwap={onProposeSwap} onViewDetails={onViewItemDetails} />
                  ))}
              </div>
          ) : (
              <div className="text-center py-10 text-gray-400">
                  <p>{request.requester.name} 的衣櫃是空的。</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsScreen;