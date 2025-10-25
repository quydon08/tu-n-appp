
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Expense } from '../types';

interface SpendingBarChartProps {
    expenses: Expense[];
}

const SpendingBarChart: React.FC<SpendingBarChartProps> = ({ expenses }) => {
    const data = useMemo(() => {
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const weeklyExpenses = dayNames.map(day => ({ name: day, 'Chi tiêu': 0 }));
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (expenseDate >= oneWeekAgo) {
                const dayIndex = expenseDate.getDay();
                weeklyExpenses[dayIndex]['Chi tiêu'] += expense.amount;
            }
        });

        return weeklyExpenses;
    }, [expenses]);

    if (expenses.length === 0) {
        return <div className="flex items-center justify-center h-64 text-gray-500">Chưa có dữ liệu chi tiêu để hiển thị.</div>
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                    <YAxis tickFormatter={(value: number) => `${(value / 1000).toLocaleString('vi-VN')}k`} tick={{ fill: 'currentColor' }} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                    <Legend />
                    <Bar dataKey="Chi tiêu" fill="#8884d8" barSize={30}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingBarChart;
