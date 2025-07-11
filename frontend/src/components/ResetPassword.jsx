import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setMessage('');
            const response = await axios.post(`/api/password-reset-confirm/${uidb64}/${token}/`, {
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setMessage(response.data.message);
            setTimeout(() => navigate('/EOB/Login'), 3000); // Redirect to login after success
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
                                <h4 className="text-center">Reset Password</h4>
                                <form onSubmit={handleSubmit} className="mx-1 mx-md-4">
                                    {message && <div className="alert alert-success">{message}</div>}
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="form-outline mb-4">
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mx-4 mb-3">
                                        <button type="submit" className="btn btn-primary btn-lg">Reset Password</button>
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

export default ResetPassword;
