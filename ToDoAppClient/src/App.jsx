import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <div className="min-h-screen bg-blue-50 p-4 relative">
            {!isLoggedIn ? (
                <AuthForm onLoginSuccess={handleLoginSuccess} />
            ) : (
                <>
                    <button
                        onClick={handleLogout}
                        className="absolute top-4 right-4 rounded-md bg-red-500 p-2 text-white shadow-md transition-colors hover:bg-red-600"
                    >
                        Вийти
                    </button>
                    <Dashboard />
                </>
            )}
        </div>
    );
}

export default App;