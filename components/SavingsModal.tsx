import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { XMarkIcon, LockClosedIcon, CurrencyDollarIcon, FlagIcon } from '@heroicons/react/24/outline';

interface SavingsModalProps {
    onClose: () => void;
    remainingIncome: number;
}

const SavingsModal: React.FC<SavingsModalProps> = ({ onClose, remainingIncome }) => {
    const { savings, updateSavings } = useAuth();
    const [pin, setPin] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(!savings.pin);
    const [error, setError] = useState('');

    const [amountToAdd, setAmountToAdd] = useState<number | ''>('');
    const [goalName, setGoalName] = useState(savings.goal?.name || '');
    const [goalTarget, setGoalTarget] = useState<number | ''>(savings.goal?.target || '');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');

    const handleUnlock = () => {
        if (pin === savings.pin) {
            setIsUnlocked(true);
            setError('');
        } else {
            setError('Mã PIN không đúng!');
        }
    };

    const handleSave = () => {
        setError(''); // Clear previous errors

        if (newPin && newPin !== confirmNewPin) {
            setError('Mã PIN mới không khớp.');
            return;
        }

        if (amountToAdd && Number(amountToAdd) > remainingIncome) {
             setError('Không đủ số dư để gửi tiết kiệm!');
             return;
        }

        const newSavingsAmount = savings.amount + Number(amountToAdd || 0);
        
        const newGoal = goalName && goalTarget ? { name: goalName, target: Number(goalTarget) } : savings.goal;

        updateSavings({
            amount: newSavingsAmount,
            goal: newGoal,
            pin: newPin || savings.pin,
        });
        onClose();
    };

    const goalProgress = savings.goal && savings.goal.target > 0 ? (savings.amount / savings.goal.target) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative animate__animated animate__fadeInUp animate__faster">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Quản lý Tiết kiệm</h2>

                {!isUnlocked ? (
                    <div className="space-y-4">
                        <p className="text-center text-gray-600 dark:text-gray-300">Nhập mã PIN để tiếp tục.</p>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <div className="relative">
                            <LockClosedIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Mã PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <button onClick={handleUnlock} className="w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition">Mở khóa</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center bg-teal-50 dark:bg-teal-900/50 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-300">Số dư hiện tại</p>
                            <p className="text-3xl font-bold text-teal-500">{savings.amount.toLocaleString('vi-VN')} VNĐ</p>
                        </div>

                        {savings.goal && (
                             <div className="w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{savings.goal.name}</span>
                                    <span className="text-sm font-medium text-teal-500">{goalProgress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.min(goalProgress, 100)}%` }}></div>
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <CurrencyDollarIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400" />
                            <input type="number" placeholder="Số tiền muốn gửi thêm" value={amountToAdd} onChange={e => setAmountToAdd(e.target.value === '' ? '' : Number(e.target.value))} className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        
                        <h3 className="text-lg font-semibold border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">Mục tiêu & Bảo mật</h3>

                        <div className="relative">
                            <FlagIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400" />
                            <input type="text" placeholder="Tên mục tiêu (ví dụ: Mua laptop)" value={goalName} onChange={e => setGoalName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div className="relative">
                            <CurrencyDollarIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400" />
                            <input type="number" placeholder="Số tiền mục tiêu (VNĐ)" value={goalTarget} onChange={e => setGoalTarget(e.target.value === '' ? '' : Number(e.target.value))} className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>

                         <div className="relative">
                            <LockClosedIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400" />
                            <input type="password" placeholder={savings.pin ? "Đổi mã PIN mới" : "Đặt mã PIN"} value={newPin} onChange={e => setNewPin(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        {newPin && (
                            <div className="relative">
                                <LockClosedIcon className="h-5 w-5 absolute top-3.5 left-4 text-gray-400" />
                                <input type="password" placeholder="Xác nhận mã PIN mới" value={confirmNewPin} onChange={e => setConfirmNewPin(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                            </div>
                        )}
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        
                        <button onClick={handleSave} className="w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition">Lưu thay đổi</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavingsModal;