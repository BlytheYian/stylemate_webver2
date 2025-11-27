
import React, { useState, useEffect, useRef } from 'react';
import { Match, Message, ClothingItem } from '../types';
import { ArrowUturnLeftIcon, PaperAirplaneIcon, TruckIcon, XMarkIcon } from './Icons';
import { db } from '../services/firebase';
import * as firestoreService from '../services/firestoreService';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

interface ChatScreenProps {
  match: Match;
  currentUserId: string;
  onBack: () => void;
  onInitiateTransaction: () => void;
  onViewTransaction: () => void;
  onViewItemDetails: (item: ClothingItem) => void;
  onCancelMatch: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ match, currentUserId, onBack, onInitiateTransaction, onViewTransaction, onViewItemDetails, onCancelMatch }) => {
  // Determine who is who
  const otherUser = match.user1.userId === currentUserId ? match.user2.clothingItem : match.user1.clothingItem;
  const myItem = match.user1.userId === currentUserId ? match.user1.clothingItem : match.user2.clothingItem;
  const myUser = match.user1.userId === currentUserId ? match.user1 : match.user2;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const isArchived = match.status === 'completed' || match.status === 'cancelled';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    const messagesRef = collection(db, 'chats', match.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            msgs.push({
                id: doc.id,
                ...data,
                timestamp: (data.timestamp instanceof Timestamp) ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
            } as Message);
        });
        setMessages(msgs);
    });

    return () => unsubscribe();
  }, [match.id]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() === '' || isArchived || !myUser.clothingItem.userAvatar) return;
    const text = newMessage.trim();
    setNewMessage('');
    await firestoreService.sendMessage(match.id, currentUserId, text, myUser.clothingItem.userAvatar);
  };

  const ItemDetailCard = ({ item, userLabel, isClickable = false, onClick }: { item: ClothingItem, userLabel: string, isClickable?: boolean, onClick?: () => void }) => {
    const content = (
        <div className="flex items-start">
            <img src={item.imageUrls[0]} alt={userLabel} className="w-16 h-20 object-cover rounded-lg mr-3"/>
            <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs">{userLabel}</p>
                <p className="font-semibold text-sm text-white truncate">{item.category}</p>
                <p className="text-gray-400 text-xs">{item.color}</p>
                <p className="text-gray-400 text-xs mt-1">NT$ {item.estimatedPrice}</p>
            </div>
        </div>
    );
    
    if (isClickable) {
        return (
            <button onClick={onClick} className="flex-1 p-1 rounded-lg hover:bg-white/5 transition-colors text-left">
                {content}
            </button>
        );
    }
    return <div className="flex-1 p-1">{content}</div>;
  };

  const renderHeaderActions = () => {
    if (match.status === 'active') {
      return (
        <div className="flex items-center gap-2">
            <button 
            onClick={onCancelMatch}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
            title="取消配對"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
            <button 
            onClick={onInitiateTransaction} 
            className="flex items-center px-3 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 transition-colors"
            >
            <TruckIcon className="w-5 h-5 text-pink-300 mr-2" />
            <span className="text-gray-300 text-xs">安排取貨</span>
            </button>
        </div>
      );
    }
    if (match.status === 'in-transaction') {
       return (
        <button 
          onClick={onViewTransaction} 
          className="flex items-center px-3 py-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
        >
          <TruckIcon className="w-5 h-5 text-blue-300 mr-2" />
          <span className="text-gray-300 text-xs">查看交易詳情</span>
        </button>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white font-sans">
      {/* Header */}
      <header className="flex items-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700/50 justify-between">
        <div className="flex items-center flex-1 min-w-0">
            <button onClick={onBack} className="mr-4 text-white hover:text-gray-300 flex-shrink-0" aria-label="返回">
            <ArrowUturnLeftIcon className="w-6 h-6" />
            </button>
            <img src={otherUser.userAvatar} alt={otherUser.userName} className="w-10 h-10 rounded-full mr-3 object-cover flex-shrink-0"/>
            <div className="min-w-0">
            <h2 className="font-bold text-white truncate">{otherUser.userName}</h2>
            <p className="text-xs text-gray-400">{isArchived ? '已離線' : '在線'}</p>
            </div>
        </div>
        <div className="flex-shrink-0 ml-2">
            {renderHeaderActions()}
        </div>
      </header>
      
      {/* Matched Items Banner */}
      <div className="flex justify-between items-center p-3 bg-gray-900/50 border-b border-white/10 shrink-0">
        <ItemDetailCard item={otherUser} userLabel={`${otherUser.userName}的物品`} isClickable={true} onClick={() => onViewItemDetails(otherUser)} />
        <div className="px-2 text-pink-400 font-bold text-xl">&harr;</div>
        <ItemDetailCard item={myItem} userLabel="您的物品" isClickable={true} onClick={() => onViewItemDetails(myItem)} />
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col gap-4 pt-2">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderId !== currentUserId && (
                        <img src={otherUser.userAvatar} alt="Sender" className="w-6 h-6 rounded-full object-cover mb-1" />
                    )}
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.senderId === currentUserId 
                            ? 'bg-pink-500 rounded-br-sm text-white' 
                            : 'bg-gray-700 rounded-bl-sm text-white'
                    }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      {isArchived ? (
         <div className="p-4 bg-gray-900 text-center border-t border-gray-700">
            <p className="text-sm text-gray-400">
                {match.status === 'cancelled' ? '此配對已取消。聊天室已封存。' : '本次交換已完成。聊天室已封存。'}
            </p>
         </div>
      ) : (
        <div className="p-4 bg-gray-900/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center bg-gray-700 rounded-full p-2 pl-4">
                <input 
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="輸入您的想法..."
                    className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                <button 
                  onClick={handleSend} 
                  disabled={!newMessage.trim()}
                  className="bg-pink-500 p-2 rounded-full text-white ml-2 disabled:bg-gray-500 transition-transform active:scale-95 hover:scale-105"
                  aria-label="傳送"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
