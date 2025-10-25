
export interface User {
    username: string;
}

export enum EducationLevel {
    THCS = 'THCS',
    THPT = 'THPT',
    DAIHOC = 'Đại học'
}

export interface Profile {
    fullName: string;
    birthYear: number;
    monthlyIncome: number;
    educationLevel: EducationLevel;
}

export enum ExpenseCategory {
    FOOD = 'Ăn uống',
    ENTERTAINMENT = 'Giải trí',
    STUDY = 'Học tập',
    TRANSPORT = 'Di chuyển',
    OTHER = 'Khác'
}

export interface Expense {
    id: string;
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: string; // ISO string format
}

export interface Savings {
    amount: number;
    goal?: {
        name: string;
        target: number;
    };
    pin?: string;
}
