import React from 'react';
import { User } from '../types';
import { IdentificationIcon, TagIcon, ClockIcon, ArrowLeftOnRectangleIcon, BookmarkIcon, InboxIcon, TruckIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onNavigate: (view: 'home' | 'account' | 'my-items' | 'history' | 'liked-items' | 'requests' | 'ongoing-transactions') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, user, onClose, onNavigate, onLogout }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-gray-800 text-white p-6 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center mb-10">
          <img src={user.avatar} alt="User Avatar" className="w-12 h-12 rounded-full mr-4 border-2 border-pink-400"/>
          <div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.username}</p>
          </div>
        </div>
        
        <nav className="flex flex-col space-y-2">
          <button onClick={() => onNavigate('account')} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left w-full">
            <IdentificationIcon className="w-6 h-6 mr-4 text-gray-400" />
            <span>帳戶</span>
          </button>
          <button onClick={() => onNavigate('my-items')} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left w-full">
            <TagIcon className="w-6 h-6 mr-4 text-gray-400" />
            <span>我的物品</span>
          </button>
          <button onClick={() => onNavigate('ongoing-transactions')} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left w-full">
            <TruckIcon className="w-6 h-6 mr-4 text-gray-400" />
            <span>正在交易</span>
          </button>
          <button onClick={() => onNavigate('requests')} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left w-full">
            <InboxIcon className="w-6 h-6 mr-4 text-gray-400" />
            <span>交換請求</span>
          </button>
          <button onClick={() => onNavigate('liked-items')} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left w-full">
            <BookmarkIcon className="w-6 h-6 mr-4 text-gray-400" />
            <span>喜愛的物品</span>
          </button>
          <button onClick={() => onNavigate('history')} className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors text-left w-full">
            <ClockIcon className="w-6 h-6 mr-4 text-gray-400" />
            <span>歷史紀錄</span>
          </button>
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={onLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
            <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-4" />
            <span>登出</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;