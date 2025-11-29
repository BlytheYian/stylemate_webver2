
import React, { useState, useRef } from 'react';
import { ClothingItem, User } from '../types';
import { generateClothingTags, fileToBase64 } from '../services/geminiService';
// Removed storage imports as we are switching to base64 strings
import { PhotoIcon, SparklesIcon, XMarkIcon, PlusIcon, PencilIcon } from './Icons';

interface UploadModalProps {
  user: User;
  onClose: () => void;
  onUpload: (newItem: Omit<ClothingItem, 'id'>) => void;
}

type Step = 'upload' | 'analyzing' | 'edit' | 'uploading';

// Helper function to compress image and return Base64 string directly
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800; // Reduced to 800px to keep Base64 string size manageable
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Convert directly to Base64 string (Data URL)
                // Quality 0.6 provides good balance between visual quality and string length
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                URL.revokeObjectURL(objectUrl);
                resolve(dataUrl);
            } else {
                URL.revokeObjectURL(objectUrl);
                reject(new Error("Canvas context is null"));
            }
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(err);
        };
    });
};

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onUpload }) => {
  const [step, setStep] = useState<Step>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('準備處理...');
  
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

  const handleSkipAI = () => {
    if (files.length === 0) {
      setError("請先選擇一张圖片。");
      return;
    }
    setError(null);
    setStep('edit');
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
    if (files.length === 0 || !user) return;
    setStep('uploading');
    setIsUploading(true);
    setError(null);
    setUploadProgress(10);
    setUploadStatusText('正在優化圖片...');
    
    try {
        // Convert all images to Base64 strings in parallel
        const processingPromises = files.map(async (file, index) => {
            // Update status for user feedback
            setUploadStatusText(`正在處理圖片 (${index + 1}/${files.length})...`);
            
            // Artificial small delay to let UI render the text update if it's too fast
            await new Promise(resolve => setTimeout(resolve, 300));

            try {
                 const base64String = await compressImage(file);
                 return base64String;
            } catch (err) {
                 console.warn("Compression failed, using original reader", err);
                 // Fallback to simple file reader if canvas fails
                 return await fileToBase64(file).then(b64 => `data:${file.type};base64,${b64}`);
            }
        });

        const imageUrls = await Promise.all(processingPromises);
        
        setUploadStatusText('儲存中...');
        setUploadProgress(100);

        // 3. Save to Firestore (via App.tsx callback)
        const newItem = {
            imageUrls, // Now these are long Base64 strings
            ...itemDetails,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
        };
        
        // Brief delay to show 100%
        setTimeout(() => {
             onUpload(newItem);
        }, 500);

    } catch (err) {
        console.error("Processing failed:", err);
        setError("圖片處理失敗，請重試。");
        setStep('edit');
    } finally {
        // setIsUploading(false); // Don't set false immediately to prevent flash
    }
  };


  const renderContent = () => {
    switch (step) {
      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center h-80">
            <svg className="animate-spin h-10 w-10 text-pink-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">正在獲取風格標籤...</p>
          </div>
        );
      case 'uploading':
        return (
          <div className="flex flex-col items-center justify-center h-80 px-8">
            <div className="w-full relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
                    處理中
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-pink-600">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-900 border border-pink-500/30">
                <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 ease-out"></div>
              </div>
            </div>
            <p className="text-gray-300 mt-2 text-sm animate-pulse">{uploadStatusText}</p>
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
                {isUploading ? '處理中...' : '新增至我的衣櫃'}
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
            
            <button 
              onClick={handleSkipAI}
              disabled={files.length === 0}
              className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-gray-300 font-bold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              手動填寫資料
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
