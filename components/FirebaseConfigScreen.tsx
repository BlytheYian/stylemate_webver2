
import React, { useState } from 'react';
import { SparklesIcon } from './Icons';
import { setFirebaseConfig } from '../services/firebase';

const FirebaseConfigScreen: React.FC = () => {
  const [configJson, setConfigJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!configJson.trim()) {
      setError('Firebase 設定 JSON 不可為空。');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const config = JSON.parse(configJson);
      // Basic validation
      if (!config.apiKey || !config.projectId) {
          throw new Error("設定物件缺少 'apiKey' 或 'projectId'。");
      }
      await setFirebaseConfig(config);
      // The page will reload, so no need to setLoading(false)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`無效的 JSON 格式或設定。請檢查您的 Firebase 設定物件。 (${errorMessage})`);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center text-center text-white p-4">
      <div className="flex items-center text-5xl font-bold text-white tracking-wider mb-4">
        <SparklesIcon className="w-12 h-12 text-pink-400 mr-3" />
        Stylemate
      </div>
      <div className="bg-gray-800 border border-purple-500/50 text-white p-6 rounded-lg max-w-lg w-11/12 shadow-xl">
        <h2 className="font-bold text-xl mb-3">連接到 Firebase</h2>
        <p className="text-sm text-gray-400 mb-2">
          請貼上您從 Firebase 主控台 (Project Settings) 取得的專案設定物件 (JSON)。
        </p>
        <div className="text-xs text-gray-500 mb-4 bg-gray-900/50 p-2 rounded text-left">
           <p className="font-bold mb-1">請確保您的專案已啟用以下服務：</p>
           <ul className="list-disc pl-4 space-y-1">
             <li><strong>Authentication:</strong> 請啟用 <b>Email/Password</b> 登入提供者。</li>
             <li><strong>Firestore Database:</strong> 設定為測試模式 (Test Mode) 或適當的規則</li>
             <li><strong>Storage:</strong> 用於上傳圖片</li>
           </ul>
        </div>
        <textarea
          value={configJson}
          onChange={(e) => setConfigJson(e.target.value)}
          placeholder={`{
  "apiKey": "AIzaSy...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}`}
          className="w-full h-48 bg-gray-900 text-gray-300 font-mono text-sm p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          aria-label="Firebase Config JSON"
        />
        {error && <p className="text-red-400 mt-3 text-sm text-left">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full disabled:opacity-50"
        >
          {isLoading ? '正在儲存...' : '儲存並連接'}
        </button>
      </div>
    </div>
  );
};

export default FirebaseConfigScreen;
