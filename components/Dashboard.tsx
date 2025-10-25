
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ExpenseCategory, Expense } from '../types';
import ExpenseChart from './ExpenseChart';
import SpendingBarChart from './SpendingBarChart';
import SavingsModal from './SavingsModal';
import { 
    ArrowRightOnRectangleIcon, 
    PlusCircleIcon, 
    BanknotesIcon, 
    Cog6ToothIcon, 
    SunIcon, 
    MoonIcon,
    HomeIcon as HomeIconOutline,
    ChartPieIcon as ChartPieIconOutline,
    TrashIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    ChartPieIcon as ChartPieIconSolid,
    PlusCircleIcon as PlusCircleIconSolid,
    BanknotesIcon as BanknotesIconSolid
} from '@heroicons/react/24/solid';


const Dashboard: React.FC = () => {
    const { profile, expenses, addExpense, logout, deleteExpense } = useAuth();
    const [amount, setAmount] = useState<number | ''>('');
    const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
    const [description, setDescription] = useState('');
    const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
    const [activeTab, setActiveTab] = useState('home');
    const [expenseError, setExpenseError] = useState('');
    const [confirmingDelete, setConfirmingDelete] = useState<Expense | null>(null);

    const totalSpent = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
    const remainingIncome = profile ? profile.monthlyIncome - totalSpent : 0;

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        setExpenseError('');
        if (amount && Number(amount) > remainingIncome) {
            setExpenseError('Số tiền chi tiêu lớn hơn số dư còn lại!');
            return;
        }
        if (amount) {
            addExpense({ amount: Number(amount), category, description });
            setAmount('');
            setDescription('');
            alert('Thêm chi tiêu thành công!');
            setActiveTab('home'); // Switch back to home after adding
        }
    };

    const handleDeleteExpense = () => {
        if (confirmingDelete) {
            deleteExpense(confirmingDelete.id);
            setConfirmingDelete(null);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const isDark = !prev;
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return isDark;
        });
    };

    if (!profile) return null;

    const navItems = [
        { id: 'home', label: 'Trang chủ', IconOutline: HomeIconOutline, IconSolid: HomeIconSolid },
        { id: 'charts', label: 'Thống kê', IconOutline: ChartPieIconOutline, IconSolid: ChartPieIconSolid },
        { id: 'add', label: 'Thêm mới', IconOutline: PlusCircleIcon, IconSolid: PlusCircleIconSolid },
        { id: 'savings', label: 'Tiết kiệm', IconOutline: BanknotesIcon, IconSolid: BanknotesIconSolid },
    ];
    
    const renderAddExpenseForm = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center"><PlusCircleIcon className="h-6 w-6 mr-2 text-indigo-500"/>Thêm chi tiêu mới</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
                 <input type="number" placeholder="Số tiền (VNĐ)" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
                 <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="text" placeholder="Mô tả (tùy chọn)" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                {expenseError && <p className="text-red-500 text-sm text-center">{expenseError}</p>}
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Thêm</button>
            </form>
        </div>
    );
    
    const renderRecentTransactions = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Lịch sử giao dịch</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto">
                {expenses.slice().reverse().map(exp => (
                    <li key={exp.id} className="flex justify-between items-center group">
                        <div>
                            <p className="font-semibold">{exp.category}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{exp.description || new Date(exp.date).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className="font-bold text-red-500">- {exp.amount.toLocaleString('vi-VN')} VNĐ</p>
                             <button onClick={() => setConfirmingDelete(exp)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity duration-200">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </li>
                ))}
                {expenses.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Chưa có giao dịch nào.</p>}
            </ul>
        </div>
    );

    const renderSavingsSection = () => (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center"><BanknotesIcon className="h-6 w-6 mr-2 text-teal-500"/>Mục Tiết Kiệm</h3>
            <button onClick={() => setIsSavingsModalOpen(true)} className="w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition flex items-center justify-center space-x-2">
                 <Cog6ToothIcon className="h-5 w-5"/>
                <span>Quản lý Tiết kiệm</span>
            </button>
        </div>
    )

    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 transition-colors duration-300`}>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Chào, {profile.fullName}!</h1>
                    <p className="text-gray-500 dark:text-gray-400">Quản lý tài chính của bạn thật dễ dàng.</p>
                </div>
                <div className="flex items-center space-x-4">
                     <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                    </button>
                    <button onClick={logout} className="flex items-center space-x-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition">
                        <ArrowRightOnRectangleIcon className="h-6 w-6"/>
                        <span className="hidden sm:inline">Đăng xuất</span>
                    </button>
                </div>
            </header>
            
            {/* Desktop View */}
            <main className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                            <h3 className="font-semibold text-gray-500 dark:text-gray-400">Thu nhập tháng</h3>
                            <p className="text-3xl font-bold text-green-500">{profile.monthlyIncome.toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                            <h3 className="font-semibold text-gray-500 dark:text-gray-400">Còn lại</h3>
                            <p className={`text-3xl font-bold ${remainingIncome >= 0 ? 'text-blue-500' : 'text-red-500'}`}>{remainingIncome.toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Chi tiêu trong tuần</h3>
                        <SpendingBarChart expenses={expenses} />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Tỷ lệ chi tiêu</h3>
                        <ExpenseChart expenses={expenses} />
                    </div>
                </div>

                <div className="space-y-6">
                    {renderAddExpenseForm()}
                    {renderSavingsSection()}
                    {renderRecentTransactions()}
                </div>
            </main>

            {/* Mobile View */}
            <main className="lg:hidden pb-24 space-y-6">
                {activeTab === 'home' && (
                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                <h3 className="font-semibold text-gray-500 dark:text-gray-400">Thu nhập tháng</h3>
                                <p className="text-3xl font-bold text-green-500">{profile.monthlyIncome.toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                <h3 className="font-semibold text-gray-500 dark:text-gray-400">Còn lại</h3>
                                <p className={`text-3xl font-bold ${remainingIncome >= 0 ? 'text-blue-500' : 'text-red-500'}`}>{remainingIncome.toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                        </div>
                        {renderRecentTransactions()}
                    </div>
                )}
                 {activeTab === 'charts' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Chi tiêu trong tuần</h3>
                            <SpendingBarChart expenses={expenses} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Tỷ lệ chi tiêu</h3>
                            <ExpenseChart expenses={expenses} />
                        </div>
                    </div>
                )}
                 {activeTab === 'add' && renderAddExpenseForm()}
                 {activeTab === 'savings' && renderSavingsSection()}
            </main>

             {/* Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-t-lg border-t border-gray-200 dark:border-gray-700 flex justify-around">
                {navItems.map(({id, label, IconOutline, IconSolid}) => (
                    <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${activeTab === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {activeTab === id ? <IconSolid className="h-6 w-6 mb-1"/> : <IconOutline className="h-6 w-6 mb-1"/>}
                        <span className="text-xs font-medium">{label}</span>
                         {activeTab === id && <div className="w-10 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1"></div>}
                    </button>
                ))}
            </nav>
            
            {isSavingsModalOpen && <SavingsModal onClose={() => setIsSavingsModalOpen(false)} remainingIncome={remainingIncome} />}

            {confirmingDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn animate__faster">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center transform transition-all">
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Xác nhận xóa</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Bạn có chắc chắn muốn xóa chi tiêu này không?
                            <br/>
                            <span className="font-semibold">{confirmingDelete.category}: {confirmingDelete.amount.toLocaleString('vi-VN')} VNĐ</span>
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button 
                                onClick={() => setConfirmingDelete(null)} 
                                className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleDeleteExpense} 
                                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
