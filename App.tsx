
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import OnboardingScreen from './components/OnboardingScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Main />
        </AuthProvider>
    );
};

const Main: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);
    const { user, profile } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000); 
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }

    if (!user) {
        return <AuthScreen />;
    }

    if (!profile) {
        return <OnboardingScreen />;
    }

    return <Dashboard />;
};

export default App;
