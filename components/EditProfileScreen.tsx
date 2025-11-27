
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface EditProfileScreenProps {
  user: User;
  onBack: () => void;
  onSave: (updatedData: Partial<User>) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    phoneNumber: user.phoneNumber || '',
    avatar: user.avatar,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct an object with only the changed fields
    const updatedData: Partial<User> = {};
    if (formData.name !== user.name) updatedData.name = formData.name;
    if (formData.username !== user.username) updatedData.username = formData.username;
    if (formData.phoneNumber !== (user.phoneNumber || '')) updatedData.phoneNumber = formData.phoneNumber;
    if (formData.avatar !== user.avatar) updatedData.avatar = formData.avatar;
    
    if (Object.keys(updatedData).length > 0) {
        onSave(updatedData);
    } else {
        onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white hover:text-gray-300 transition-colors" aria-label="返回">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">編輯個人資料</h2>
      </header>

      {/* Scrollable Content */}
      <form onSubmit={handleSubmit} className="flex-grow p-6 flex flex-col items-center overflow-y-auto">
        {/* Avatar Section */}
        <div className="relative mb-6 cursor-pointer group" onClick={handleAvatarClick}>
          <img 
            src={formData.avatar} 
            alt="User Avatar" 
            className="w-24 h-24 rounded-full border-4 border-pink-400 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-bold">上傳</span>
          </div>
        </div>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />

        {/* Form Fields */}
        <div className="w-full max-w-[400px] space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium text-gray-400 mb-1">名稱</label>
            <input 
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium text-gray-400 mb-1">使用者名稱</label>
            <input 
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-400 mb-1">電話號碼</label>
            <input 
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors placeholder-gray-400"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          type="submit" 
          className="mt-8 w-full max-w-[400px] bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-transform transform active:scale-95 duration-150"
        >
            儲存變更
        </button>
      </form>
    </div>
  );
};

export default EditProfileScreen;
