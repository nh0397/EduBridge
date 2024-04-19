import React from 'react';
import './Navbar.css';
import logo from '../../images/eduBridge-logo.webp';

function Navbar() {
    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="navbar-container">
            <div className="navbar-left">
                <img src={logo} alt="App Logo" className="app-logo" />
                <div className="app-name">EduBridge</div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="navbar-right">
                <div className="user-info">
                    <span className="username">{sessionStorage.getItem('firstName')}</span>
                    <span className="role">{sessionStorage.getItem('role')}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
