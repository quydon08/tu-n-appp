
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserIcon, KeyIcon, ArrowRightOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const AuthScreen: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isRegister) {
            if (password !== confirmPassword) {
                setError('Mật khẩu không khớp!');
                return;
            }
            if(username.length < 3 || password.length < 6) {
                setError('Tên người dùng phải có ít nhất 3 ký tự và mật khẩu ít nhất 6 ký tự.');
                return;
            }
            // Simulate registration by storing credentials in localStorage
            localStorage.setItem(`user_${username}`, password);
            login({ username });
        } else {
            const storedPassword = localStorage.getItem(`user_${username}`);
            if (storedPassword === password) {
                login({ username });
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-2">
                    {isRegister ? 'Đăng Ký' : 'Đăng Nhập'}
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                    Chào mừng bạn đến với ứng dụng quản lý chi tiêu!
                </p>

                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <UserIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>
                    <div className="relative">
                        <KeyIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400"/>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>
                    {isRegister && (
                        <div className="relative">
                            <KeyIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400"/>
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 flex items-center justify-center space-x-2"
                    >
                        {isRegister ? <UserPlusIcon className="h-5 w-5" /> : <ArrowRightOnRectangleIcon className="h-5 w-5" />}
                        <span>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</span>
                    </button>
                </form>

                <p className="text-center mt-8 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}</span>
                    <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        {isRegister ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;
