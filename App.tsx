
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as FirebaseAuth from 'firebase/auth';
import { auth, testFirestoreConnection, ensureUserDocument } from './services/firebase';
import { getUserAppState, saveUserAppState, UserAppStatePayload, getUserProfile, saveUserProfile } from './services/userData';
import { ClothingItem, Match, User, LikedItem, Request, Transaction, TransactionPartyDetails } from './types';
import { INITIAL_DECK, AVATAR_OPTIONS } from './constants';
import { Timestamp } from 'firebase/firestore';

import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import SwipingScreen from './components/SwipingScreen';
import ChatScreen from './components/ChatScreen';
import MatchModal from './components/MatchModal';
import UploadModal from './components/UploadModal';
import Sidebar from './components/Sidebar';
import AccountScreen from './components/AccountScreen';
import MyItemsScreen from './components/MyItemsScreen';
import HistoryScreen from './components/HistoryScreen';
import LogoutModal from './components/LogoutModal';
import ItemDetailsScreen from './components/ItemDetailsScreen';
import MatchDetailsScreen from './components/MatchDetailsScreen';
import EditProfileScreen from './components/EditProfileScreen';
import DeleteItemModal from './components/DeleteItemModal';
import EditItemScreen from './components/EditItemScreen';
import LikedItemsScreen from './components/LikedItemsScreen';
import LikedItemDetailsScreen from './components/LikedItemDetailsScreen';
import RequestsScreen from './components/RequestsScreen';
import RequestDetailsScreen from './components/RequestDetailsScreen';
import ProposeSwapModal from './components/ProposeSwapModal';
import TransactionFormModal from './components/TransactionFormModal';
import OngoingTransactionsScreen from './components/OngoingTransactionsScreen';
import TransactionDetailsScreen from './components/TransactionDetailsScreen';
import RejectRequestModal from './components/RejectRequestModal';
import ViewOnlyItemDetailsModal from './components/ViewOnlyItemDetailsModal';
import CancelMatchModal from './components/CancelMatchModal';
import LoginScreen from './components/LoginScreen';
import LoggedOutScreen from './components/LoggedOutScreen';
import { SparklesIcon } from './components/Icons';

type AppView = 'home' | 'swiping' | 'chat' | 'account' | 'my-items' | 'history' | 'item-details' | 'match-details' | 'edit-profile' | 'edit-item' | 'liked-items' | 'liked-item-details' | 'requests' | 'request-details' | 'ongoing-transactions' | 'transaction-details' | 'logged-out';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);
  const [view, setView] = useState<AppView>('home');
  const [deck, setDeck] = useState<ClothingItem[]>([]);
  const [myCloset, setMyCloset] = useState<ClothingItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [swipedDirection, setSwipedDirection] = useState<'left' | 'right' | null>(null);
  const [latestMatch, setLatestMatch] = useState<Match | null>(null);
  const [activeChatMatch, setActiveChatMatch] = useState<Match | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeItem, setActiveItem] = useState<ClothingItem | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [seenItemIds, setSeenItemIds] = useState<Set<string>>(new Set());
  
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [activeLikedItem, setActiveLikedItem] = useState<LikedItem | null>(null);

  const [requests, setRequests] = useState<Request[]>([]);
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);

  const [swapProposal, setSwapProposal] = useState<{ myItem: ClothingItem, theirItem: ClothingItem } | null>(null);

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [showRejectRequestModal, setShowRejectRequestModal] = useState(false);
  const [viewOnlyItem, setViewOnlyItem] = useState<ClothingItem | null>(null);
  const [showCancelMatchModal, setShowCancelMatchModal] = useState(false);
  
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyUserAppState = useCallback((state: Partial<UserAppStatePayload>) => {
    setMyCloset(state.myCloset ?? []);
    setMatches(state.matches ?? []);
    setLikedItems(state.likedItems ?? []);
    setRequests(state.requests ?? []);
    setTransactions(state.transactions ?? []);
    setSeenItemIds(new Set(state.seenItemIds ?? []));
  }, []);

  const buildInitialUserAppState = useCallback((user: User): UserAppStatePayload => {
    return {
      myCloset: [],
      matches: [],
      likedItems: [],
      requests: [],
      transactions: [],
      seenItemIds: [],
    };
  }, []);

  const initializeDataForUser = useCallback(async (user: User) => {
    setIsUserDataLoading(true);
    try {
      const remoteState = await getUserAppState(user.id);
      if (remoteState) {
        applyUserAppState(remoteState);
      } else {
        const initialState = buildInitialUserAppState(user);
        applyUserAppState(initialState);
        await saveUserAppState(user.id, initialState);
      }
    } catch (error) {
      console.warn('[App] Failed to load user data, fallback to defaults', error);
      const fallbackState = buildInitialUserAppState(user);
      applyUserAppState(fallbackState);
    } finally {
      setIsUserDataLoading(false);
    }
  }, [applyUserAppState, buildInitialUserAppState]);

  const resetAppState = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setDeck([]);
    setActiveCardIndex(0);
    setSwipedDirection(null);
    setLatestMatch(null);
    setActiveChatMatch(null);
    setShowUploadModal(false);
    setIsSidebarOpen(false);
    setShowLogoutModal(false);
    setActiveItem(null);
    setActiveMatch(null);
    setSeenItemIds(new Set());
    setMyCloset([]);
    setMatches([]);
    setLikedItems([]);
    setRequests([]);
    setTransactions([]);
    setActiveRequest(null);
    setActiveLikedItem(null);
    setSwapProposal(null);
    setShowTransactionForm(false);
    setActiveTransaction(null);
    setShowDeleteItemModal(false);
    setShowRejectRequestModal(false);
    setViewOnlyItem(null);
    setShowCancelMatchModal(false);
    setView('home');
    setIsUserDataLoading(false);
  }, []);

  const navigateTo = useCallback((newView: AppView) => {
    setView(newView);
    setIsSidebarOpen(false);
    setActiveChatMatch(null);
    if (newView !== 'item-details' && newView !== 'edit-item') setActiveItem(null);
    if (newView !== 'match-details') setActiveMatch(null);
    if (newView !== 'liked-item-details') setActiveLikedItem(null);
    if (newView !== 'request-details') setActiveRequest(null);
    if (newView !== 'transaction-details') setActiveTransaction(null);
  }, []);

  const handleLogin = useCallback(async (firebaseUser: FirebaseAuth.User) => {
    if (!firebaseUser) return;
    if (currentUser?.id === firebaseUser.uid) {
      setIsLoggedIn(true);
      return;
    }

    const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Stylemate User';
    
    // Ensure user document exists in Firestore
    const userDocSnap = await ensureUserDocument(firebaseUser).catch(err => {
      console.warn('[App] ensureUserDocument error', err);
      return null;
    });

    const storedProfile = await getUserProfile(firebaseUser.uid);
    const createdAtTimestamp = (storedProfile as any)?.createdAt || userDocSnap?.data()?.createdAt;
    
    // Handle timestamp conversion safely
    let joinDate = '2024-07-01';
    if (storedProfile?.joinDate) {
        joinDate = storedProfile.joinDate;
    } else if (createdAtTimestamp instanceof Timestamp) {
        joinDate = createdAtTimestamp.toDate().toISOString().split('T')[0];
    }

    const newUser: User = {
        id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        name: storedProfile?.name || displayName,
        username: storedProfile?.username || `@${displayName.toLowerCase().replace(/\s/g, '')}`,
        avatar: firebaseUser.photoURL || storedProfile?.avatar || AVATAR_OPTIONS[0],
        email: storedProfile?.email || firebaseUser.email || '',
        joinDate,
        phoneNumber: storedProfile?.phoneNumber || firebaseUser.phoneNumber || '',
    };
    
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    await initializeDataForUser(newUser);
    navigateTo('home');
  }, [currentUser?.id, initializeDataForUser, navigateTo]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = FirebaseAuth.onAuthStateChanged(auth, user => {
      if (user) {
        handleLogin(user).finally(() => setAuthInitializing(false));
      } else {
        resetAppState();
        setAuthInitializing(false);
      }
    });
    return unsubscribe;
  }, [handleLogin, resetAppState]);

  // Dev connection test
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      (async () => {
        try {
          await testFirestoreConnection('test');
        } catch (e) {
          console.warn('[App] Firestore test connection error', e);
        }
      })();
    }
  }, []);

  // Auto-save effect with debounce
  useEffect(() => {
    if (!currentUser || isUserDataLoading) return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    const payload: UserAppStatePayload = {
      myCloset,
      matches,
      likedItems,
      requests,
      transactions,
      seenItemIds: Array.from(seenItemIds),
    };
    
    saveTimeoutRef.current = setTimeout(() => {
      saveUserAppState(currentUser.id, payload).catch(err => console.warn('[App] Failed to save user data', err));
    }, 800);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [currentUser, isUserDataLoading, myCloset, matches, likedItems, requests, transactions, seenItemIds]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentUser) return;
    setSwipedDirection(direction);
    
    const swipedItem = deck[activeCardIndex];
    setSeenItemIds(prev => new Set(prev).add(swipedItem.id));

    if (direction === 'right') {
      const newLikedItem: LikedItem = {
        id: `like-${Date.now()}`,
        item: swipedItem,
        status: 'pending',
        userId: currentUser.id
      };
      setLikedItems(prev => [newLikedItem, ...prev]);

      // Demo matching logic (random)
      if (Math.random() < 0.3 && myCloset.length > 0) {
        const myMatchedItem = myCloset[Math.floor(Math.random() * myCloset.length)];
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          user1: { userId: currentUser.id, clothingItem: myMatchedItem },
          user2: { userId: swipedItem.userId, clothingItem: swipedItem },
          matchedAt: new Date().toISOString(),
          status: 'active',
          participants: [currentUser.id, swipedItem.userId]
        };
        setTimeout(() => {
          setLatestMatch(newMatch);
          setMatches(prev => [newMatch, ...prev]);
          // Remove from liked if matched immediately
          setLikedItems(prev => prev.filter(liked => liked.item.id !== swipedItem.id));
        }, 600);
      }
    }

    setTimeout(() => {
      setActiveCardIndex(prev => prev + 1);
      setSwipedDirection(null);
    }, 500);
  };

  const startSwiping = () => {
    // Filter initial deck against seen items and my own items
    const filteredDeck = INITIAL_DECK.filter(item => !seenItemIds.has(item.id) && item.userId !== currentUser?.id);
    setDeck(filteredDeck);
    setActiveCardIndex(0);
    navigateTo('swiping');
  };

  const navigateToChat = (match: Match) => {
    setActiveChatMatch(match);
    setView('chat');
  };

  const handleViewItemDetails = (item: ClothingItem) => {
    setActiveItem(item);
    setView('item-details');
  };

  const handleViewMatchDetails = (match: Match) => {
    setActiveMatch(match);
    setView('match-details');
  };

  const handleViewLikedItemDetails = (likedItem: LikedItem) => {
    setActiveLikedItem(likedItem);
    setView('liked-item-details');
  };
  
  const handleViewRequestDetails = (request: Request) => {
    setActiveRequest(request);
    navigateTo('request-details');
  };
  
  const handleViewTransactionDetails = (transaction: Transaction) => {
    setActiveTransaction(transaction);
    navigateTo('transaction-details');
  };

  const closeMatchModal = () => {
    setLatestMatch(null);
  };

  const handleStartChat = (match: Match) => {
    closeMatchModal();
    navigateToChat(match);
  };

  const handleAddNewItem = (newItem: Omit<ClothingItem, 'id' | 'userId' | 'userName' | 'userAvatar'>) => {
    if(!currentUser) return;
    const fullNewItem: ClothingItem = {
      ...newItem,
      id: `my-item-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
    };
    setMyCloset(prev => [fullNewItem, ...prev]);
    setShowUploadModal(false);
  };
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  const handleLogout = () => {
      setIsSidebarOpen(false);
      setShowLogoutModal(true);
  }

  const confirmLogout = async () => {
      setShowLogoutModal(false);
      try {
        await FirebaseAuth.signOut(auth);
      } catch (error) {
        console.warn('[App] signOut error', error);
        resetAppState();
      }
  }

  const handleInitiateTransaction = () => {
    setShowTransactionForm(true);
  }

  const handleCreateTransaction = (details: TransactionPartyDetails) => {
    if (!activeChatMatch || !currentUser) return;
  
    const existingTransaction = transactions.find(t => t.matchId === activeChatMatch.id);
  
    if (existingTransaction) {
      const updatedTransaction: Transaction = {
        ...existingTransaction,
        parties: {
          ...existingTransaction.parties,
          [currentUser.id]: details,
        },
      };
      setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    } else {
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        matchId: activeChatMatch.id,
        status: 'ongoing',
        parties: {
          [currentUser.id]: details,
        },
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  
    setMatches(prev => prev.map(m => m.id === activeChatMatch.id ? { ...m, status: 'in-transaction' } : m));
    
    setShowTransactionForm(false);
    navigateTo('ongoing-transactions');
  };
  
  const handleCompleteTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: 'completed' } : t));
    setMatches(prev => prev.map(m => m.id === transaction.matchId ? { ...m, status: 'completed', completedAt: new Date().toISOString() } : m));
    
    navigateTo('home');
  };

  const handleCancelTransaction = (transactionId: string) => {
     const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: 'cancelled' } : t));
    setMatches(prev => prev.map(m => m.id === transaction.matchId ? { ...m, status: 'active' } : m));

    navigateTo('ongoing-transactions');
  };

  const handleCancelMatch = () => {
    if (!activeChatMatch) return;
    
    // Update local state - this will auto-sync via useEffect
    setMatches(prev => prev.map(m => 
      m.id === activeChatMatch.id ? { ...m, status: 'cancelled' } : m
    ));
    
    setShowCancelMatchModal(false);
    // Navigate home after cancellation to refresh view and prevent interaction
    navigateTo('home');
  };

  const handleUpdateProfile = (updatedUser: Partial<User>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updatedUser };
    setCurrentUser(newUser);
    saveUserProfile(newUser).catch(err => console.warn('[App] Failed to save user profile', err));
    navigateTo('account');
  };

  const handleNavigateToEditItem = (item: ClothingItem) => {
    setActiveItem(item);
    setView('edit-item');
  };

  const handleOpenDeleteModal = (item: ClothingItem) => {
    setActiveItem(item);
    setShowDeleteItemModal(true);
  };

  const handleConfirmDeleteItem = () => {
    if (!activeItem) return;
    setMyCloset(prev => prev.filter(item => item.id !== activeItem.id));
    setShowDeleteItemModal(false);
    setActiveItem(null);
    navigateTo('my-items');
  };

  const handleSaveItemChanges = (updatedItem: ClothingItem) => {
    setMyCloset(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setMatches(prev => prev.map(match => {
        if (match.user1.clothingItem.id === updatedItem.id) {
            return { ...match, user1: { ...match.user1, clothingItem: updatedItem } };
        }
        return match;
    }));
    setActiveItem(updatedItem);
    navigateTo('item-details');
  };

  const handleRemoveLikedItem = (likedItemId: string) => {
    setLikedItems(prev => prev.filter(item => item.id !== likedItemId));
    navigateTo('liked-items');
  };

  const handleProposeSwap = (requesterItem: ClothingItem) => {
    if (!activeRequest) return;
    setSwapProposal({ myItem: activeRequest.itemOfInterest, theirItem: requesterItem });
  };

  const handleConfirmProposeSwap = () => {
    if (!swapProposal || !activeRequest || !currentUser) return;

    const newMatch: Match = {
        id: `match-${Date.now()}`,
        user1: { userId: currentUser.id, clothingItem: swapProposal.myItem },
        user2: { userId: activeRequest.requester.id, clothingItem: swapProposal.theirItem },
        matchedAt: new Date().toISOString(),
        status: 'active',
        participants: [currentUser.id, activeRequest.requester.id]
    };

    setMatches(prev => [newMatch, ...prev]);
    setRequests(prev => prev.filter(req => req.id !== activeRequest.id));
    
    setSwapProposal(null);
    setActiveRequest(null);
    
    navigateToChat(newMatch);
  };
  
  const handleRejectRequest = () => {
    if (!activeRequest) return;
    setShowRejectRequestModal(true);
  };

  const handleConfirmRejectRequest = () => {
    if (!activeRequest) return;
    setRequests(prev => prev.filter(req => req.id !== activeRequest.id));
    setShowRejectRequestModal(false);
    navigateTo('requests');
  };

  const renderView = () => {
    if (!currentUser) return null;
    const ongoingTransactions = transactions.filter(t => t.status === 'ongoing');

    switch(view) {
      case 'swiping':
        return <SwipingScreen 
                  deck={deck}
                  activeCardIndex={activeCardIndex}
                  swipedDirection={swipedDirection}
                  handleSwipe={handleSwipe}
                  onNoMoreCardsUpload={() => setShowUploadModal(true)}
               />;
      case 'chat':
        if (activeChatMatch) {
            const currentMatchState = matches.find(m => m.id === activeChatMatch.id) || activeChatMatch;
            return <ChatScreen 
                      match={currentMatchState} 
                      currentUserId={currentUser.id}
                      onBack={() => navigateTo('home')} 
                      onInitiateTransaction={handleInitiateTransaction}
                      onViewTransaction={() => {
                        const transaction = transactions.find(t => t.matchId === currentMatchState.id);
                        if (transaction) handleViewTransactionDetails(transaction);
                      }}
                      onViewItemDetails={setViewOnlyItem}
                      onCancelMatch={() => setShowCancelMatchModal(true)}
                   />;
        }
        navigateTo('home'); 
        return null;
      case 'account':
        return <AccountScreen user={currentUser} onBack={() => navigateTo('home')} onEdit={() => navigateTo('edit-profile')} />;
      case 'edit-profile':
        return <EditProfileScreen user={currentUser} onBack={() => navigateTo('account')} onSave={handleUpdateProfile} />;
      case 'my-items':
        return <MyItemsScreen items={myCloset} onBack={() => navigateTo('home')} onItemClick={handleViewItemDetails} />;
      case 'history':
        return <HistoryScreen matches={matches} onBack={() => navigateTo('home')} onMatchClick={handleViewMatchDetails}/>;
      case 'item-details':
          if (activeItem) {
              return <ItemDetailsScreen 
                        item={activeItem} 
                        onBack={() => navigateTo('my-items')}
                        onEdit={handleNavigateToEditItem}
                        onDelete={handleOpenDeleteModal}
                     />;
          }
          navigateTo('my-items');
          return null;
      case 'edit-item':
          if (activeItem) {
              return <EditItemScreen
                        item={activeItem}
                        onBack={() => setView('item-details')}
                        onSave={handleSaveItemChanges}
                     />
          }
          navigateTo('my-items');
          return null;
      case 'match-details':
          if (activeMatch) {
              return <MatchDetailsScreen match={activeMatch} onBack={() => navigateTo('history')} onOpenChat={navigateToChat} />;
          }
          navigateTo('history');
          return null;
      case 'liked-items':
          return <LikedItemsScreen likedItems={likedItems} onBack={() => navigateTo('home')} onItemClick={handleViewLikedItemDetails} />;
      case 'liked-item-details':
          if (activeLikedItem) {
              return <LikedItemDetailsScreen 
                        likedItem={activeLikedItem} 
                        onBack={() => navigateTo('liked-items')} 
                        onRemove={handleRemoveLikedItem}
                     />;
          }
          navigateTo('liked-items');
          return null;
      case 'requests':
          return <RequestsScreen requests={requests} onBack={() => navigateTo('home')} onRequestClick={handleViewRequestDetails} />;
      case 'request-details':
          if (activeRequest) {
              return <RequestDetailsScreen 
                        request={activeRequest} 
                        onBack={() => navigateTo('requests')} 
                        onProposeSwap={handleProposeSwap}
                        onReject={handleRejectRequest}
                        onViewItemDetails={setViewOnlyItem}
                     />;
          }
          navigateTo('requests');
          return null;
      case 'ongoing-transactions':
        return <OngoingTransactionsScreen 
                  transactions={ongoingTransactions}
                  matches={matches}
                  onBack={() => navigateTo('home')}
                  onTransactionClick={handleViewTransactionDetails}
                />;
      case 'transaction-details':
        if (activeTransaction) {
          const match = matches.find(m => m.id === activeTransaction.matchId);
          if (match) {
            return <TransactionDetailsScreen 
                      transaction={activeTransaction}
                      match={match}
                      currentUserId={currentUser.id}
                      onBack={() => navigateTo('ongoing-transactions')}
                      onOpenChat={navigateToChat}
                      onComplete={handleCompleteTransaction}
                      onCancel={handleCancelTransaction}
                   />;
          }
        }
        navigateTo('ongoing-transactions');
        return null;
      case 'home':
      default:
        // Filter out cancelled matches from Home screen
        return <HomeScreen 
                  matches={matches.filter(m => m.status === 'active' || m.status === 'in-transaction')}
                  onStartSwiping={startSwiping}
                  onOpenChat={navigateToChat}
               />;
    }
  };

  if (authInitializing) {
      return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center text-center text-white p-4">
            <SparklesIcon className="w-24 h-24 text-pink-400 mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold">Connecting to Styleverse...</h1>
        </div>
      );
  }

  if (view === 'logged-out') {
      return <LoggedOutScreen onLogin={() => setIsLoggedIn(false)} />;
  }

  if (!isLoggedIn || !currentUser) {
      // LoginScreen handles its own auth logic which triggers onAuthStateChanged -> handleLogin
      return <LoginScreen />;
  }

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden font-sans">
      {isUserDataLoading ? (
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
            <p className="text-gray-300">同步您的資料中...</p>
        </div>
      ) : (
        <>
            <Sidebar 
                isOpen={isSidebarOpen} 
                user={currentUser}
                onClose={() => setIsSidebarOpen(false)}
                onNavigate={navigateTo}
                onLogout={handleLogout}
            />
            
            {['home', 'swiping'].includes(view) && <Header 
                onUploadClick={() => setShowUploadModal(true)} 
                onProfileClick={toggleSidebar} 
                showBackButton={view === 'swiping'}
                onBackClick={() => navigateTo('home')}
            />}
            
            <main className="flex-grow relative overflow-y-auto bg-gray-900">
                {renderView()}
            </main>

            {latestMatch && <MatchModal match={latestMatch} onClose={closeMatchModal} onStartChat={handleStartChat} />}
            {showUploadModal && <UploadModal user={currentUser} onClose={() => setShowUploadModal(false)} onUpload={handleAddNewItem} />}
            {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
            {showDeleteItemModal && <DeleteItemModal onConfirm={handleConfirmDeleteItem} onCancel={() => setShowDeleteItemModal(false)} />}
            {swapProposal && <ProposeSwapModal proposal={swapProposal} onConfirm={handleConfirmProposeSwap} onCancel={() => setSwapProposal(null)} />}
            {showTransactionForm && activeChatMatch && <TransactionFormModal user={currentUser} match={activeChatMatch} onClose={() => setShowTransactionForm(false)} onCreateTransaction={handleCreateTransaction} />}
            {showRejectRequestModal && <RejectRequestModal onConfirm={handleConfirmRejectRequest} onCancel={() => setShowRejectRequestModal(false)} />}
            {showCancelMatchModal && <CancelMatchModal onConfirm={handleCancelMatch} onCancel={() => setShowCancelMatchModal(false)} />}
            {viewOnlyItem && <ViewOnlyItemDetailsModal item={viewOnlyItem} onClose={() => setViewOnlyItem(null)} />}
        </>
      )}
    </div>
  );
};

export default App;
