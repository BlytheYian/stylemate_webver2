
import React from 'react';
import { Request } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface RequestsScreenProps {
  requests: Request[];
  onBack: () => void;
  onRequestClick: (request: Request) => void;
}

const RequestsScreen: React.FC<RequestsScreenProps> = ({ requests, onBack, onRequestClick }) => {

  const renderItem = (item: Request) => (
    <button 
        key={item.id}
        onClick={() => onRequestClick(item)} 
        className="w-full flex flex-row items-center p-3 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors mb-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
    >
      <img src={item.requester.avatar} alt={item.requester.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
      <div className="flex-1">
        <p className="font-semibold text-white">
          <span className="font-bold">{item.requester.name}</span> 喜歡您的...
        </p>
        <div className="flex items-center mt-1">
           <img src={item.itemOfInterest.imageUrls[0]} alt={item.itemOfInterest.category} className="w-8 h-10 object-cover rounded-sm mr-2"/>
           <span className="text-sm text-gray-300 font-normal">{item.itemOfInterest.category}</span>
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white font-sans">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white hover:text-gray-300 transition-colors" aria-label="返回">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">交換請求</h2>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto">
        {requests.length > 0 ? (
          <div className="w-full">
            {requests.map(renderItem)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>目前沒有交換請求。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsScreen;
