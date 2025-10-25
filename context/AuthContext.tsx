
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User, Profile, Expense, Savings } from '../types';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    expenses: Expense[];
    savings: Savings;
    login: (user: User) => void;
    logout: () => void;
    saveProfile: (profileData: Profile) => void;
    addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
    deleteExpense: (expenseId: string) => void;
    updateSavings: (newSavings: Partial<Savings>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('expense_app_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [profile, setProfile] = useState<Profile | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [savings, setSavings] = useState<Savings>({ amount: 0 });

    useEffect(() => {
        if (user) {
            const storedProfile = localStorage.getItem(`expense_app_profile_${user.username}`);
            const storedExpenses = localStorage.getItem(`expense_app_expenses_${user.username}`);
            const storedSavings = localStorage.getItem(`expense_app_savings_${user.username}`);
            
            if (storedProfile) setProfile(JSON.parse(storedProfile));
            if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
            if (storedSavings) setSavings(JSON.parse(storedSavings));
        } else {
            setProfile(null);
            setExpenses([]);
            setSavings({ amount: 0 });
        }
    }, [user]);

    const login = (userData: User) => {
        localStorage.setItem('expense_app_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('expense_app_user');
        setUser(null);
    };

    const saveProfile = (profileData: Profile) => {
        if (user) {
            localStorage.setItem(`expense_app_profile_${user.username}`, JSON.stringify(profileData));
            setProfile(profileData);
        }
    };

    const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
        if (user) {
            const newExpense: Expense = {
                ...expenseData,
                id: new Date().getTime().toString(),
                date: new Date().toISOString(),
            };
            const updatedExpenses = [...expenses, newExpense];
            setExpenses(updatedExpenses);
            localStorage.setItem(`expense_app_expenses_${user.username}`, JSON.stringify(updatedExpenses));
        }
    };

    const deleteExpense = (expenseId: string) => {
        if (user) {
            const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
            setExpenses(updatedExpenses);
            localStorage.setItem(`expense_app_expenses_${user.username}`, JSON.stringify(updatedExpenses));
        }
    };
    
    const updateSavings = (newSavingsData: Partial<Savings>) => {
        if (user) {
            const updatedSavings = { ...savings, ...newSavingsData };
            setSavings(updatedSavings);
            localStorage.setItem(`expense_app_savings_${user.username}`, JSON.stringify(updatedSavings));
        }
    };


    return (
        <AuthContext.Provider value={{ user, profile, expenses, savings, login, logout, saveProfile, addExpense, deleteExpense, updateSavings }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
