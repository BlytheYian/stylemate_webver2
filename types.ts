
export interface User {
  id: string; // Firestore document ID
  firebaseUid: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  joinDate: string; // ISO String
  phoneNumber?: string;
  myCloset?: ClothingItem[];
  matches?: Match[];
  requests?: Request[];
  likedItems?: LikedItem[];
  transactions?: Transaction[];
  seenItemIds?: string[];
}

export interface ClothingItem {
  id: string;
  userId: string;
  userName:string;
  userAvatar: string;
  imageUrls: string[]; // Changed from imageUrl to support multiple images
  category: string;
  color: string;
  style_tags: string[];
  description?: string;
  estimatedPrice: number;
}

export interface Match {
  id: string;
  user1: {
    userId: string;
    clothingItem: ClothingItem;
  };
  user2: {
    userId: string;
    clothingItem: ClothingItem;
  };
  matchedAt: string;
  completedAt?: string;
  status: 'active' | 'in-transaction' | 'completed' | 'cancelled';
  // Add participants array for easier querying
  participants: string[]; 
}

export interface Message {
  id: string;
  senderId: string; // 'user-1' for me, or the other user's ID
  text: string;
  timestamp: string;
  senderAvatar: string;
}

export type LikedItemStatus = 'pending' | 'matched' | 'rejected';

export interface LikedItem {
  id: string; // A unique ID for the like itself
  item: ClothingItem;
  status: LikedItemStatus;
  userId: string;
}

export interface Request {
  id: string;
  requester: {
    id: string;
    name: string;
    avatar: string;
    closet: ClothingItem[];
  };
  itemOfInterest: ClothingItem; // The item of mine they liked
}

export type PickupMethod = '7-11' | 'FamilyMart' | 'OK Mart' | 'Home Delivery' | '面交';
export type TransactionStatus = 'ongoing' | 'completed' | 'cancelled';

export interface TransactionPartyDetails {
  phoneNumber: string;
  pickupMethod: PickupMethod;
  pickupLocation: string;
}

export interface Transaction {
  id: string;
  matchId: string;
  parties: {
    [userId: string]: TransactionPartyDetails; // Dictionary keyed by userId
  };
  status: TransactionStatus;
}
