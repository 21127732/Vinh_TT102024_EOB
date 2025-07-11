import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    token: null,
    isLoggedIn: false,  // Added isLoggedIn state
    username: '',
    login: () => { },
    logout: () => { },
    error: null,
    setUsername: () => { },
});

export default AuthContext;
