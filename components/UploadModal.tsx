
import React, { useState, useRef } from 'react';
import { ClothingItem, User } from '../types';
import { generateClothingTags, fileToBase64 } from '../services/geminiService';
import { db, storage } from '../services/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { PhotoIcon, SparklesIcon, XMarkIcon, PlusIcon } from './Icons';

interface UploadModalProps {
  user: User;
  onClose: () => void;
  onUpload: (newItem: Omit<ClothingItem, 'id'>) => void;
}

type Step = 'upload' | 'analyzing' | 'edit' | 'uploading';

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onUpload }) => {
  const [step, setStep] = useState<Step>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemDetails, setItemDetails] = useState({
      category: '',
      color: '',
      style_tags: [] as string[],
      description: '',
      estimatedPrice: 0,
  });
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setError(null);
      setFiles([selectedFile]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews([reader.result as string]);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAddMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        if (file instanceof Blob) {
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleGetVibeTags = async () => {
    if (files.length === 0) {
      setError("請先選擇一张圖片。");
      return;
    }
    
    setStep('analyzing');
    setError(null);

    try {
      const firstFile = files[0];
      const base64Image = await fileToBase64(firstFile);
      const tags = await generateClothingTags(base64Image, firstFile.type);
      setItemDetails({ ...tags, description: '' });
      setStep('edit');
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("AI圖片分析失敗，請重試。");
        }
        setStep('upload');
    }
  };

  const handleDetailsChange = (field: keyof typeof itemDetails, value: string | number) => {
    setItemDetails(prev => ({
        ...prev,
        [field]: field === 'style_tags' && typeof value === 'string' 
            ? value.split(',').map(tag => tag.trim()) 
            : value
    }));
  };

  const handleFinalUpload = async () => {
    if (previews.length === 0 || !user) return;
    setStep('uploading');
    setIsUploading(true);
    setError(null);
    try {
        // 1. Upload images to Firebase Storage
        const imageUrls: string[] = [];
        for (const preview of previews) {
            const imageRef = ref(storage, `items/${user.id}/${Date.now()}`);
            const uploadResult = await uploadString(imageRef, preview, 'data_url');
            const downloadURL = await getDownloadURL(uploadResult.ref);
            imageUrls.push(downloadURL);
        }

        // 2. Call onUpload with the Storage URLs
        const newItem = {
            imageUrls,
            ...itemDetails,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
        };
        onUpload(newItem);
    } catch (err) {
        console.error("Upload failed:", err);
        setError("上傳失敗，請重試。");
        setStep('edit');
    } finally {
        setIsUploading(false);
    }
  };


  const renderContent = () => {
    switch (step) {
      case 'analyzing':
      case 'uploading':
        return (
          <div className="flex flex-col items-center justify-center h-80">
            <svg className="animate-spin h-10 w-10 text-pink-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">{step === 'analyzing' ? '正在獲取風格標籤...' : '正在上傳物品...'}</p>
          </div>
        );
      case 'edit':
        return (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/5 flex-shrink-0">
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-700 mb-2">
                  {previews[0] && <img src={previews[0]} alt="主要預覽" className="w-full h-full object-cover"/>}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {previews.slice(1).map((p, i) => (
                    <img key={i} src={p} className="w-full aspect-square object-cover rounded-md" />
                  ))}
                   <button onClick={() => additionalFileInputRef.current?.click()} className="w-full aspect-square bg-gray-700 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-600">
                      <PlusIcon className="w-6 h-6" />
                   </button>
                   <input type="file" ref={additionalFileInputRef} onChange={handleAddMoreImages} multiple accept="image/*" className="hidden" />
                </div>
              </div>
              <div className="w-full md:w-3/5 flex-grow flex flex-col space-y-3">
                <input type="text" placeholder="類別" value={itemDetails.category} onChange={e => handleDetailsChange('category', e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"/>
                <input type="text" placeholder="顏色" value={itemDetails.color} onChange={e => handleDetailsChange('color', e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"/>
                <div className="relative">
                  <input type="number" placeholder="預估價格" value={itemDetails.estimatedPrice} onChange={e => handleDetailsChange('estimatedPrice', parseInt(e.target.value) || 0)} className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 pl-12"/>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">TWD</span>
                </div>
                <input type="text" placeholder="風格標籤 (以逗號分隔)" value={itemDetails.style_tags.join(', ')} onChange={e => handleDetailsChange('style_tags', e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"/>
                <textarea placeholder="新增描述..." value={itemDetails.description} onChange={e => handleDetailsChange('description', e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 flex-grow"></textarea>
              </div>
            </div>
            <button onClick={handleFinalUpload} disabled={isUploading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full disabled:opacity-50">
                {isUploading ? '上傳中...' : '新增至我的衣櫃'}
            </button>
          </div>
        );
      case 'upload':
      default:
        return (
          <div className="space-y-4">
            {previews.length > 0 ? (
              <div className="w-full h-64 rounded-xl overflow-hidden">
                  <img src={previews[0]} alt="預覽" className="w-full h-full object-cover"/>
              </div>
            ) : (
              <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center">
                <PhotoIcon className="w-16 h-16 text-gray-500 mb-2"/>
                <p className="text-gray-400">您的圖片將會顯示在此</p>
              </div>
            )}
            
            <label htmlFor="file-upload" className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition-colors text-center block">
              {files.length > 0 ? `已選擇: ${files[0].name}` : '選擇圖片'}
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>

            <button 
              onClick={handleGetVibeTags} 
              disabled={files.length === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              獲取風格標籤
            </button>
          </div>
        );
    }
  };

  const modalMaxWidth = step === 'edit' ? 'max-w-3xl' : 'max-w-md';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`bg-gray-800 rounded-3xl p-6 w-full ${modalMaxWidth} text-white shadow-2xl border border-purple-500/30 relative transition-all duration-300`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">
            {step === 'edit' ? '編輯您的風格' : '上傳您的風格'}
        </h2>
        
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        {renderContent()}

      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UploadModal;
