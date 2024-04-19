import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../images/eduBridge-logo.webp';
import apiService from "../../services/apiService";
import DiscussionForum from "../DiscussionForum/DiscussionForum"; // Import DiscussionForum component
import UploadContentPage from '../Landing/InstructorLanding/UploadContentPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons

function Navbar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(null); // State to control the active tab
    const [isModalOpen, setModalOpen] = useState(false); // Define isModalOpen state
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

    const handleTabClick = (tabName) => {
        setActiveTab(tabName === activeTab ? null : tabName); // Toggle active tab
    };

    const closeTab = () => {
        setActiveTab(null);
    };

    const toggleModal = () => {
        setModalOpen(!isModalOpen); // Toggle modal state
    };

    const fetchFiles = async () => {
        try {
            const filesData = await apiService.fetchAllFiles();
        } catch (error) {
            console.error('Error fetching files:', error);
            // Display error message to the user
        }
    };

    return (
        <div className="navbar-container">
            <div className="navbar-left">
                {/* Link the logo and app name to the correct homepage based on the user's role */}
                <Link to={homePath} className="home-link">
                    <img src={logo} alt="App Logo" className="app-logo" />
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
                {/* Render "Upload New Content" link only for instructors */}
                {userRole === 'instructor' && (
                    <button onClick={toggleModal} className="upload-button">
                        <FontAwesomeIcon icon={isModalOpen ? faTimes : faCloudUploadAlt} />
                        {isModalOpen ? 'Close' : 'Upload New Content'}
                    </button>
                )}
                <button onClick={() => handleTabClick('discussionForum')} className={activeTab === 'discussionForum' ? 'active-tab' : 'tab-button'}>Discussion Forum</button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            {/* Render discussion forum tab based on the activeTab state */}
            {activeTab === 'discussionForum' && (
                <div className="tab-content">
                    <DiscussionForum onClose={closeTab} /> {/* Pass onClose prop to close the tab */}
                </div>
            )}
            {/* Render upload modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}><FontAwesomeIcon icon={faTimes} /></span>
                        <UploadContentPage onSuccess={fetchFiles} onClose={toggleModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;








