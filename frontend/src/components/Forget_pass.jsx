import React, { useState } from 'react';
import axios from 'axios';

function ForgetPass() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setMessage('');
            const response = await axios.post('/api/password-reset/', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <section style={{ backgroundColor: '#eee' }}>
            <div className="container h-100" style={{ paddingBottom: '50px' }}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-7 col-xl-6">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <h4 className="text-center">Forget Password</h4>
                                <form onSubmit={handleSubmit} className="mx-1 mx-md-4">
                                    {message && <div className="alert alert-success">{message}</div>}
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="form-outline mb-4">
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mx-4 mb-3">
                                        <button type="submit" className="btn btn-primary btn-lg">Send Reset Link</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ForgetPass;
