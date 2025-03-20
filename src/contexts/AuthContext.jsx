import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('USER_LOGIN') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        if (token) {
            localStorage.setItem('USER_LOGIN', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('USER_LOGIN');
            localStorage.removeItem('user');
        }
    }, [token, user]);

    const login = (accessToken, userInfo) => {
        setToken(accessToken);
        setUser(userInfo);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
