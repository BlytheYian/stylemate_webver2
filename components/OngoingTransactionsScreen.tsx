import React from 'react';
import { Transaction, Match } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface OngoingTransactionsScreenProps {
  transactions: Transaction[];
  matches: Match[];
  onBack: () => void;
  onTransactionClick: (transaction: Transaction) => void;
}

const OngoingTransactionsScreen: React.FC<OngoingTransactionsScreenProps> = ({ transactions, matches, onBack, onTransactionClick }) => {
  const getMatchForTransaction = (transaction: Transaction) => {
    return matches.find(match => match.id === transaction.matchId);
  }

  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white" aria-label="返回主頁">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">正在交易</h2>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto">
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map(transaction => {
              const match = getMatchForTransaction(transaction);
              if (!match) return null;
              
              const theirItem = match.user2.clothingItem;

              return (
                <button 
                  key={transaction.id} 
                  onClick={() => onTransactionClick(transaction)}
                  className="w-full flex items-center p-3 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <img src={theirItem.imageUrls[0]} alt={theirItem.category} className="w-16 h-20 object-cover rounded-md mr-4"/>
                  <div className="flex-grow">
                    <p className="font-semibold">與 {theirItem.userName} 的交易</p>
                    <p className="text-sm text-gray-400">正在交換您的 {match.user1.clothingItem.category}</p>
                    <p className="text-xs text-blue-400 mt-1">點擊查看詳情</p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>目前沒有進行中的交易。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingTransactionsScreen;