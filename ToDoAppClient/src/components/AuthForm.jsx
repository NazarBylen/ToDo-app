import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin ? { email, password } : { name, email, password };
            const response = await axios.post(`http://localhost:3000${endpoint}`, payload);
            localStorage.setItem('token', response.data.access_token);
            onLoginSuccess();
        } catch (error) {
            console.log(error);
            alert('Error!');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-extrabold text-blue-800">
                    {isLogin ? 'Вхід' : 'Реєстрація'}
                </h2>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-4 w-full rounded-md border border-blue-200 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full rounded-md border border-blue-200 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-6 w-full rounded-md border border-blue-200 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 p-3 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
                >
                    {isLogin ? 'Увійти' : 'Зареєструватись'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 w-full rounded-md p-3 font-medium text-blue-600 hover:underline"
                >
                    {isLogin ? 'Створити обліковий запис' : 'Я вже маю обліковий запис'}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;