import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../images/eduBridge-logo.webp';
import apiService from "../../services/apiService";

function Navbar() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const userRole = sessionStorage.getItem('role'); // Retrieve the user's role
    const homePath = userRole === 'instructor' ? '/instructor' : '/student'; // Determine the home path

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/login';
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const searchedFiles = await apiService.fetchSearchedFiles(searchTerm);
            console.log('Searched files:', searchedFiles);
        } catch (error) {
            console.error('Error searching files:', error);
        }
    };

    return (
        <div className="navbar-container">
            <div className="navbar-left">
                {/* Link the logo and app name to the correct homepage based on the user's role */}
                <Link to={homePath} className="home-link">
                    <img src={logo} alt="App Logo" className="app-logo" />
                    <div className="app-name">EduBridge</div>
                </Link>
            </div>
            <div className="search-bar">
                <input 
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onInput={handleSearch}
                />
            </div>
            <div className="navbar-right">
                <div className="user-info">
                    <span className="username">{sessionStorage.getItem('firstName')}</span>
                    <span className="role">{userRole}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
}

export default Navbar;

