
import React, { useState } from 'react';
import * as FirebaseAuth from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { SparklesIcon, TheIconSmall } from './Icons';
import FirebaseConfigScreen from './FirebaseConfigScreen';

const LoginScreen: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfig, setShowConfig] = useState(false);

    const toggleMode = () => {
        setMode(prev => (prev === 'login' ? 'register' : 'login'));
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('請輸入 Email 與密碼。');
            return;
        }

        if (mode === 'register') {
            if (!name.trim()) {
                setError('請輸入顯示名稱。');
                return;
            }
            if (password.length < 6) {
                setError('密碼至少需 6 碼。');
                return;
            }
            if (password !== confirmPassword) {
                setError('兩次輸入的密碼不一致。');
                return;
            }
        }

        try {
            setIsLoading(true);
            if (mode === 'register') {
                const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(auth, email.trim(), password);
                if (name.trim()) {
                    await FirebaseAuth.updateProfile(userCredential.user, { displayName: name.trim() });
                }
            } else {
                await FirebaseAuth.signInWithEmailAndPassword(auth, email.trim(), password);
            }
        } catch (error: any) {
            console.error("Authentication failed:", error);
            let msg = error.message;
            if (error.code === 'auth/invalid-email') msg = "無效的電子郵件格式。";
            if (error.code === 'auth/user-disabled') msg = "此帳戶已被停用。";
            if (error.code === 'auth/user-not-found') msg = "沒有此帳號，請先註冊。";
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') msg = "Email 或密碼錯誤。";
            if (error.code === 'auth/email-already-in-use') msg = "此 Email 已被使用。";
            if (error.code === 'auth/weak-password') msg = "密碼安全性不足 (至少 6 碼)。";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isFirebaseConfigured || showConfig) {
        return <FirebaseConfigScreen />;
    }

    return (
        <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
            <div className="flex items-center mb-4">
                <TheIconSmall className="w-16 h-16 text-pink-400 mr-3" />
                <h1 className="text-5xl font-bold text-white tracking-widest">Stylemate</h1>
            </div>
            <p className="text-gray-400 max-w-xs text-center mb-8">交換您的風格，找到您的 Style。</p>
            
            <form onSubmit={handleAuth} className="w-full flex flex-col items-center max-w-xs">
                {mode === 'register' && (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="顯示名稱"
                        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 mb-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                    />
                )}
                
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 mb-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                />
                
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="密碼"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 mb-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                />

                {mode === 'register' && (
                     <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="再次輸入密碼"
                        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 mb-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                    />
                )}

                {error && <p className="w-full text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-500/20 text-center mb-3">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-lg mt-3 mb-4 shadow-md transition-transform transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                >
                    {isLoading ? <span className="animate-pulse">處理中...</span> : (mode === 'login' ? '登入' : '建立帳號')}
                </button>

                <button 
                    type="button"
                    onClick={toggleMode}
                    className="text-pink-400 hover:text-pink-300 font-medium mt-1 transition-colors"
                >
                    {mode === 'login' ? '還沒有帳號？立即註冊' : '已經有帳號？返回登入'}
                </button>
            </form>
            
            <button 
                onClick={() => setShowConfig(true)}
                className="mt-12 text-gray-600 hover:text-gray-400 text-xs underline transition-colors"
            >
                更換 Firebase 設定
            </button>
        </div>
    );
};

export default LoginScreen;
