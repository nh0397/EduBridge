import React, { useState } from 'react';
import apiService from '../../services/apiService';

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
            await apiService.resetPassword(email, otp, newPassword);
            setMessage('Your password has been reset successfully. You can now login with your new password.');
        } catch (error) {
            setMessage('Failed to reset password. Please ensure your OTP is correct and try again.');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Reset Password</h2>
            {!resetSent ? (
                <form onSubmit={handleRequestReset}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <button type="submit">Send Reset Link</button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
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
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter your new password"
                        />
                    </div>
                    <button type="submit">Reset Password</button>
                </form>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPassword;