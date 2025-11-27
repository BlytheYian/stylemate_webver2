
import React, { useState } from 'react';
import { ClothingItem } from '../types';
import { ArrowUturnLeftIcon } from './Icons';

interface EditItemScreenProps {
  item: ClothingItem;
  onBack: () => void;
  onSave: (updatedItem: ClothingItem) => void;
}

const EditItemScreen: React.FC<EditItemScreenProps> = ({ item, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    category: item.category,
    color: item.color,
    style_tags: item.style_tags,
    description: item.description || '',
    estimatedPrice: item.estimatedPrice,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'style_tags' 
        ? value.split(',').map(tag => tag.trim()) 
        : name === 'estimatedPrice'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...item, ...formData });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onBack} className="mr-4 text-white hover:text-gray-300 transition-colors" aria-label="返回">
          <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl">編輯物品</h2>
      </header>

      {/* Scroll View Container */}
      <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto">
        <img 
            src={item.imageUrls[0]} 
            alt="Preview" 
            className="w-full h-64 object-cover rounded-xl mb-6" 
        />
        
        <div className="w-full">
            <input 
                type="text" 
                name="category"
                placeholder="類別" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg text-white mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition-shadow"
            />
            
            <input 
                type="text" 
                name="color"
                placeholder="顏色" 
                value={formData.color} 
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg text-white mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition-shadow"
            />

            <div className="relative w-full mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 font-sans">TWD</span>
                <input 
                    type="number" 
                    name="estimatedPrice"
                    placeholder="預估價格" 
                    value={formData.estimatedPrice} 
                    onChange={handleChange}
                    className="w-full bg-gray-800 p-3 pl-14 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition-shadow"
                />
            </div>

            <input 
                type="text" 
                name="style_tags"
                placeholder="風格標籤 (以逗號分隔)" 
                value={formData.style_tags.join(', ')} 
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg text-white mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition-shadow"
            />

            <textarea 
                name="description"
                placeholder="新增描述..." 
                value={formData.description} 
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg text-white mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 align-top transition-shadow"
            />
            
            <button 
                type="submit" 
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-full mt-4 transition-all shadow-lg active:scale-95 transform duration-150"
            >
                儲存變更
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemScreen;
