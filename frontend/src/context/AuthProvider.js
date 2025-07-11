import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import Cookies from 'js-cookie';


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token') || null);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username') || Cookies.get('username') || '');
    const [id, setId] = useState(localStorage.getItem('id') || '');
    const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [tax_num, setTax_num] = useState(localStorage.getItem('tax_num') || '');
    const [is_individual, setIndividual] = useState(localStorage.getItem('is_individual') || '');
    const [is_organization, setOrganization] = useState(localStorage.getItem('is_organization') || '');
    const [rank, setRank] = useState(localStorage.getItem('rank') || '1');

    const getCsrfToken = () => Cookies.get('csrftoken');
    const login = async (username, password, rememberMe) => {
        try {
            const loginResponse = await axios.post('/api/login', {
                uname: username,
                pass: password,
                checkbox: rememberMe,
            });

            if (loginResponse.data.success) {
                const accessToken = loginResponse.data.access;
                const refreshToken = loginResponse.data.refresh;

                // Store tokens in localStorage
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);

                console.log('Login successful!');
                console.log('Access Token:', accessToken);
                console.log('Refresh Token:', refreshToken);

                const { user } = loginResponse.data; // Extract user data
                setUser(user);
                setUsername(user?.username || '');
                setToken(accessToken);
                setIsLoggedIn(true);

                // Store user data in separate localStorage fields
                localStorage.setItem('username', user?.username || '');

                console.log('Stored Organization Data in localStorage:', user);

                // If rememberMe is checked, store the credentials in cookies
                if (rememberMe) {
                    Cookies.set('username', username, { expires: 30 });  // Remember username for 30 days
                    Cookies.set('password', password, { expires: 30 });  // Remember password for 30 days (hashed if needed)
                    Cookies.set('rememberMe', true, { expires: 30 });  // Remember 'remember me' checkbox state
                } else {
                    Cookies.remove('username');  // Remove cookies if not checked
                    Cookies.remove('password');
                    Cookies.remove('rememberMe');
                }

                // Fetch authenticated user's details using the retrieve endpoint
                const fetchUserDetails = async () => {
                    const csrfToken = getCsrfToken();
                    try {
                        const response = await axios.get(`/members/${user?.username}/`, {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'X-CSRFToken': csrfToken,
                            },
                        });

                        setId(response.data.id || '');
                        localStorage.setItem('id', response.data.id || '');

                        setRank(response.data.rank || '1');
                        localStorage.setItem('rank', response.data.rank || '1');

                        // Handle `is_individual` and `is_organization` conditions
                        if (response.data.is_individual) {
                            setPhone(response.data.phone || '');
                            setEmail(response.data.email || '');
                            setIndividual(response.data.is_individual || '');



                            localStorage.setItem('phone', response.data.phone || '');
                            localStorage.setItem('email', response.data.email || '');
                            localStorage.setItem('is_individual', response.data.is_individual || '');
                        }

                        if (response.data.is_organization) {
                            setPhone(response.data.phone || '');
                            setEmail(response.data.email || '');
                            setOrganization(response.data.is_organization || '');
                            setTax_num(response.data.tax_num || '');

                            localStorage.setItem('id', response.data.id || '');
                            localStorage.setItem('phone', response.data.organization_phone || '');
                            localStorage.setItem('email', response.data.organization_email || '');
                            localStorage.setItem('is_organization', response.data.is_organization || '');
                            localStorage.setItem('tax_num', response.data.tax_num || '');
                        }

                        console.log('Members API response:', response.data);

                    } catch (error) {
                        console.error('Error fetching user details:', error);
                    }
                };

                fetchUserDetails();
            } else {
                setError('Login failed. User does not exist or is unauthorized.');
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setError('An error occurred while logging in.');
            setIsLoggedIn(false);
        }
    };

    const googleLoginSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        const csrfToken = getCsrfToken();
        console.log(csrfToken);

        try {
            const response = await fetch('/api/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ token }),


            });

            const data = await response.json();

            if (data.success) {
                const accessToken = data.access;
                const refreshToken = data.refresh;

                const { email, username } = data;

                // Store the token, email, and username in localStorage
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                localStorage.setItem('email', email);
                localStorage.setItem('username', username);

                console.log('Google login successful, user info stored.');
                fetchUserData(accessToken);


            } else {
                setError('Google login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during Google login:', error);
            setError('An error occurred during Google login.');
        }
    };


    // Google login error handler
    const googleLoginError = (error) => {
        console.log('Login Failed:', error);
        setError('Google login failed. Please try again.');
    };



    const logout = () => {
        setUser(null);
        setUsername('');
        setToken(null);
        setIsLoggedIn(false);
        localStorage.clear();
        Cookies.remove('authToken');
    };

    const updateUserData = async (updatedData) => {
        try {
            const csrfToken = getCsrfToken();  // Ensure CSRF token is included if necessary
            const response = await axios.put(`/api/members/${username}/`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRFToken': csrfToken,  // Include CSRF token for Django if needed
                },
            });

            if (response.data) {

                setEmail(response.data.email || '');
                setPhone(response.data.phone || '');
                console.log('User data updated successfully!');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };



    const fetchUserData = async (storedToken) => {
        try {
            const response = await axios.get('/api/user', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`, // Use the token fetched from localStorage
                },
            });

            setIsLoggedIn(true)
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoggedIn(false);
        }
    };


    useEffect(() => {

        const storedToken = localStorage.getItem('access_token'); // Get the token from localStorage
        if (storedToken) {


            fetchUserData(storedToken);
        } else {
            setIsLoggedIn(false);
        }
    }, []);


    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoggedIn,
            username,
            login,
            logout,
            error,
            setUsername,
            setEmail,
            setPhone,
            phone,
            email,
            tax_num,
            is_individual,
            is_organization,
            id,
            fetchUserData,
            googleLoginSuccess,
            googleLoginError,
            updateUserData,
        }}>

            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
