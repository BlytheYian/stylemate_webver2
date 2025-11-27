
import React from 'react';
import { UserCircleIcon, ArrowUpTrayIcon, ArrowUturnLeftIcon, TheIconSmall } from './Icons';

interface HeaderProps {
  onUploadClick: () => void;
  onProfileClick: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUploadClick, onProfileClick, showBackButton, onBackClick }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-800/50">
      <div className="flex-1 flex items-center justify-start">
        { showBackButton ? (
          <button onClick={onBackClick} className="text-gray-400 hover:text-white transition-colors p-1" aria-label="返回主頁">
            <ArrowUturnLeftIcon className="w-8 h-8" />
          </button>
        ) : (
          <button onClick={onProfileClick} className="text-gray-400 hover:text-white transition-colors p-1" aria-label="開啟選單">
            <UserCircleIcon className="w-8 h-8" />
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-center">
        <TheIconSmall className="w-9 h-9 text-pink-400 mr-2" />
        <span className="text-2xl font-bold text-white tracking-widest">Stylemate</span>
      </div>

      <div className="flex-1 flex items-center justify-end">
        <button onClick={onUploadClick} className="text-gray-400 hover:text-white transition-colors p-1" aria-label="上傳物品">
            <ArrowUpTrayIcon className="w-8 h-8"/>
        </button>
      </div>
    </header>
  );
};

export default Header;
