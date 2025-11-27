
import React from 'react';
import { SparklesIcon } from './Icons';

interface LoggedOutScreenProps {
  onLogin: () => void;
}

const LoggedOutScreen: React.FC<LoggedOutScreenProps> = ({ onLogin }) => {
  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center text-center text-white p-4">
      <SparklesIcon className="w-24 h-24 text-pink-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2">您已成功登出。</h1>
      <p className="text-gray-400 max-w-xs mb-8">感謝您與我們交換風格！</p>
      <button
        onClick={onLogin}
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
      >
        再次登入
      </button>
    </div>
  );
};

export default LoggedOutScreen;