
import React, { useState } from 'react';
import { Match, PickupMethod, TransactionPartyDetails, User } from '../types';
import { XMarkIcon } from './Icons';

interface TransactionFormModalProps {
  match: Match;
  user: User;
  onClose: () => void;
  onCreateTransaction: (details: TransactionPartyDetails) => void;
}

const convenienceStores: PickupMethod[] = ['7-11', 'FamilyMart', 'OK Mart'];
const storeBranches: { [key: string]: string[] } = {
  '7-11': ['台北南港門市', '台中西屯門市', '高雄左營門市'],
  'FamilyMart': ['新北板橋門市', '桃園中壢門市', '台南東區門市'],
  'OK Mart': ['基隆仁愛門市', '新竹東區門市', '嘉義西區門市'],
};


const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ match, user, onClose, onCreateTransaction }) => {
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>('7-11');
  const [pickupLocation, setPickupLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!phoneNumber.trim() || !pickupLocation.trim()) {
      setError('所有欄位皆為必填。');
      return;
    }
    setError('');
    onCreateTransaction({
      phoneNumber,
      pickupMethod,
      pickupLocation
    });
  };

  const renderLocationInput = () => {
    if (pickupMethod === 'Home Delivery' || pickupMethod === '面交') {
      return (
        <input 
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder={pickupMethod === 'Home Delivery' ? "請輸入完整宅配地址" : "請輸入建議的面交地點"}
          className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      );
    }
    
    // Convenience Store selection
    const branches = storeBranches[pickupMethod] || [];
    return (
       <select
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
       >
          <option value="">選擇門市</option>
          {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
       </select>
    );
  };
  

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md text-white shadow-2xl border border-purple-500/30 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">安排取貨資訊</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">聯絡電話</label>
            <input 
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="您的手機號碼"
              className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">取貨方式</label>
            <div className="grid grid-cols-2 gap-2">
              {/* FIX: Explicitly type the 'method' parameter to avoid type inference issues. */}
              {[...convenienceStores, 'Home Delivery', '面交'].map((method: PickupMethod) => (
                <button
                  key={method}
                  onClick={() => {
                    setPickupMethod(method);
                    setPickupLocation(''); // Reset location on method change
                  }}
                  className={`p-3 rounded-lg text-sm text-center transition-colors ${pickupMethod === method ? 'bg-pink-500 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {method === 'Home Delivery' ? '宅配' : method}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              {pickupMethod === 'Home Delivery' ? '宅配地址' : pickupMethod === '面交' ? '面交地點' : '取貨門市'}
            </label>
            {renderLocationInput()}
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full mt-4"
          >
            確認並送出
          </button>
        </div>
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

export default TransactionFormModal;
