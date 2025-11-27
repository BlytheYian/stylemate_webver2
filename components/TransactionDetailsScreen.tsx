import React from 'react';
import { Transaction, Match, ClothingItem, TransactionPartyDetails } from '../types';
import { ArrowUturnLeftIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon, XMarkIcon } from './Icons';

interface TransactionDetailsScreenProps {
  transaction: Transaction;
  match: Match;
  currentUserId: string;
  onBack: () => void;
  onOpenChat: (match: Match) => void;
  onComplete: (transactionId: string) => void;
  onCancel: (transactionId: string) => void;
}

const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({ transaction, match, currentUserId, onBack, onOpenChat, onComplete, onCancel }) => {
  const myUserId = currentUserId;
  const theirUserId = match.user1.userId === myUserId ? match.user2.userId : match.user1.userId;
  
  const myItem = match.user1.userId === myUserId ? match.user1.clothingItem : match.user2.clothingItem;
  const theirItem = match.user1.userId === myUserId ? match.user2.clothingItem : match.user1.clothingItem;

  const myDetails = transaction.parties[myUserId];
  const theirDetails = transaction.parties[theirUserId];

  const PartyInfoCard = ({ item, details, label }: { item: ClothingItem, details?: TransactionPartyDetails, label: string }) => (
    <div className="bg-gray-800 rounded-2xl p-4 flex flex-col h-full space-y-3 flex-1">
        {/* Item Info */}
        <div className="flex space-x-4">
            <img src={item.imageUrls[0]} alt={label} className="w-24 h-32 object-cover rounded-lg shadow-md flex-shrink-0"/>
            <div className="text-left">
                <p className="text-lg font-bold text-white">{label}</p>
                <p className="text-base text-gray-300">{item.category}</p>
                <p className="text-sm text-gray-400">{item.color}</p>
                <p className="text-base text-pink-400 font-semibold mt-1">NT$ {item.estimatedPrice}</p>
            </div>
        </div>

        <hr className="border-gray-700" />

        {/* Transaction Info */}
        <div className="space-y-2 text-sm flex-grow flex flex-col">
             <h4 className="text-base font-bold text-gray-200 mb-1">取貨資訊</h4>
             {details ? (
                <>
                    <div className="flex justify-between">
                        <span className="text-gray-400">聯絡電話</span>
                        <span className="font-mono">{details.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">取貨方式</span>
                        <span>{details.pickupMethod}</span>
                    </div>
                    <div className="flex justify-between items-start text-left">
                        <span className="text-gray-400 flex-shrink-0 mr-4">地點</span>
                        <span className="text-right">{details.pickupLocation}</span>
                    </div>
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center h-full text-gray-500 py-4">
                    <p>等待對方提供...</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white" aria-label="返回交易列表">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">交易詳情</h2>
      </header>
      
      <div className="flex-grow p-4 md:p-6 flex flex-col justify-between overflow-y-auto">
        {/* Main content area */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Their Side (Left) */}
            <PartyInfoCard 
                item={theirItem} 
                details={theirDetails} 
                label={`${theirItem.userName}的物品`} 
            />
            
            {/* My Side (Right) */}
            <PartyInfoCard 
                item={myItem} 
                details={myDetails} 
                label="您的物品" 
            />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex-shrink-0 space-y-3">
             <button 
                onClick={() => onOpenChat(match)}
                className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full"
            >
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                進入聊天室
            </button>
            <div className="flex space-x-3">
                <button 
                    onClick={() => onCancel(transaction.id)}
                    className="flex-1 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 px-4 rounded-full transition-colors"
                >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    取消交易
                </button>
                <button 
                    onClick={() => onComplete(transaction.id)}
                    className="flex-1 flex items-center justify-center bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold py-3 px-4 rounded-full transition-colors"
                >
                    <CheckBadgeIcon className="w-5 h-5 mr-2" />
                    完成交易
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsScreen;