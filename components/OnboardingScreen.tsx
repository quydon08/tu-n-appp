
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EducationLevel } from '../types';

const OnboardingScreen: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [birthYear, setBirthYear] = useState<number | ''>('');
    const [monthlyIncome, setMonthlyIncome] = useState<number | ''>('');
    const [educationLevel, setEducationLevel] = useState<EducationLevel>(EducationLevel.THPT);
    const { saveProfile } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fullName && birthYear && monthlyIncome !== '') {
            saveProfile({
                fullName,
                birthYear: Number(birthYear),
                monthlyIncome: Number(monthlyIncome),
                educationLevel,
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Thông tin cá nhân</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                    Vui lòng cập nhật thông tin để bắt đầu.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Năm sinh</label>
                        <input
                            id="birthYear"
                            type="number"
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value === '' ? '' : parseInt(e.target.value))}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thu nhập hàng tháng (VNĐ)</label>
                        <input
                            id="monthlyIncome"
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value === '' ? '' : parseInt(e.target.value))}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cấp học</label>
                        <select
                            id="educationLevel"
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                        >
                            <option value={EducationLevel.THCS}>THCS</option>
                            <option value={EducationLevel.THPT}>THPT</option>
                            <option value={EducationLevel.DAIHOC}>Đại học</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
                    >
                        Lưu thông tin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingScreen;
