import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    function insertUserToken(tkn, userData = null) {
        setToken(tkn);
        if (tkn) {
            localStorage.setItem('token', tkn);
        }
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }

    function logOutContext() {
        setToken(null);
        setUserId(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    function decodeUserToken() {
        try {
            const decodeToken = jwtDecode(token);
            setUserId(decodeToken.user);
        } catch (e) {
            console.error('Failed to decode token:', e);
            setUserId(null);
        }
    }

    useEffect(() => {
        if (token) {
            decodeUserToken();
        } else {
            setUserId(null);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, userId, user, setUser, insertUserToken, logOutContext }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

