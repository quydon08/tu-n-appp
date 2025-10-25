import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Expense } from '../types';
import { ExpenseCategory } from '../types';

interface ExpenseChartProps {
    expenses: Expense[];
}

const COLORS = {
    [ExpenseCategory.FOOD]: '#8884d8',
    [ExpenseCategory.ENTERTAINMENT]: '#82ca9d',
    [ExpenseCategory.STUDY]: '#ffc658',
    [ExpenseCategory.TRANSPORT]: '#ff8042',
    [ExpenseCategory.OTHER]: '#00C49F',
};


const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
    const data = useMemo(() => {
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {} as { [key in ExpenseCategory]?: number });

        return Object.entries(categoryTotals).map(([name, value]) => ({
            name: name as ExpenseCategory,
            value,
        }));
    }, [expenses]);
    
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-64 text-gray-500">Chưa có dữ liệu chi tiêu để hiển thị.</div>
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        // Fix: The type provided by recharts for the label prop is sometimes incomplete. Cast to `any` to access the `percent` property.
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;