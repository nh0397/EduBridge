import React, { useState } from 'react';
import apiService from '../../services/apiService';
import './ForgotPassword.css'

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        try {
            await apiService.requestPasswordReset(email);
            setMessage('If the email is registered, you will receive a password reset email shortly.');
            setResetSent(true);
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await apiService.resetPasswordWithOtp(email, otp, newPassword);
            setMessage('Your password has been reset successfully. You can now login with your new password.');
        } catch (error) {
            setMessage('Failed to reset password. Please ensure your OTP is correct and try again.');
        }
    };

    return (
        <div className='full-container'>


        <div className="forgot-password-container">
            <h2>Reset Password</h2>
            {!resetSent ? (
                <form onSubmit={handleRequestReset} className="password-reset-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                     <div className="register-link">
            <p>Go back to <a href="/login">Login</a></p>
        </div>
                    <button type="submit" className="submit-btn">Send Reset Link</button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="password-reset-form">
                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            className="input-field"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="Enter OTP"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="input-field"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter your new password"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Reset Password</button>
                    <div className="register-link">
            <p>Go back to <a href="/login">Login</a></p>
        </div>
                </form>
            )}
            {message && <p className="reset-message">{message}</p>}
        </div>
        </div>
    );

}

export default ForgotPassword;