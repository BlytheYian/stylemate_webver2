
import React from 'react';
import { User } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface AccountScreenProps {
  user: User;
  onBack: () => void;
  onEdit: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ user, onBack, onEdit }) => {
  // 計算已完成的配對數量
  const completedSwaps = user.matches?.filter(m => m.status === 'completed').length || 0;

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col h-full text-white bg-gray-900">
      {/* Header */}
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0 border-b border-gray-800">
        <button onClick={onBack} className="mr-4 text-white hover:text-gray-300 transition-colors" aria-label="返回">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">帳戶</h2>
      </header>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center">
        <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-24 h-24 rounded-full mb-4 border-4 border-pink-400 object-cover shadow-lg"
        />
        <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
        <p className="text-gray-400 text-sm mb-6">{user.username}</p>

        {/* Details Container */}
        <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 space-y-5 shadow-xl border border-gray-700">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-400 font-medium">電子郵件</span>
                <span className="text-white text-sm">{user.email}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-400 font-medium">電話號碼</span>
                <span className="text-white text-sm">{user.phoneNumber || '未設定'}</span>
            </div>
             <div className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-400 font-medium">加入於</span>
                <span className="text-white text-sm">{formatDate(user.joinDate)}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">完成交換</span>
                <span className="text-pink-400 font-bold">{completedSwaps}</span>
            </div>
        </div>
        
        <button 
          onClick={onEdit}
          className="mt-8 w-full max-w-md bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-transform transform hover:scale-[1.02] active:scale-95"
        >
            編輯個人資料
        </button>
      </div>
    </div>
  );
};

export default AccountScreen;
