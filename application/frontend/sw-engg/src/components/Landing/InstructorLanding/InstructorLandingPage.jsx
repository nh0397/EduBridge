import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructorLandingPage.css';
import Modal from '../../DiscussionForum/Modal';
import apiService from '../../../services/apiService';
import { Box, Paper, Typography } from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentIcon from '@mui/icons-material/Comment';
import PhotoCarousel from './PhotoCarousel';
import CoursesCarousel from './CoursesCarousel';
import FilesCarousel from './FilesCarousel';
import { TabContext } from '../../context/TabContext';
import { SearchContext } from '../../context/SearchContext';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';



const InstructorLandingPage = (props) => {
    const { activeTab, setActiveTab } = useContext(TabContext);
    const { searchTerm } = useContext(SearchContext);
    const [files, setFiles] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0); // Track total typing time
    const [focusAwayTime, setFocusAwayTime] = useState(0); // Track total focus away time
    const [lastBlurTime, setLastBlurTime] = useState(null); // Track the last blur time
    const [typedCharacters, setTypedCharacters] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(null); // WPM calculated in real time
    const navigate = useNavigate();
    const role = sessionStorage.getItem('role');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const list = () => (
    <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
    >
        <List>
        <ListItem button onClick={() => navigate('/assignments/1')}>
            <ListItemText primary="Assignment 1: Simple Writing Prompt" />
        </ListItem>
        <ListItem button onClick={() => navigate('/assignments/2')}>
            <ListItemText primary="Assignment 2: Reasoning and Reflection" />
        </ListItem>
        <ListItem button onClick={() => navigate('/assignments/3')}>
            <ListItemText primary="Assignment 3: Technical Writing and Problem Solving" />
        </ListItem>
        </List>
    </Box>
    );


    const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setDrawerOpen(open);
};

    const fetchFiles = async () => {
        try {
            const filesData = await apiService.fetchAllFiles();
            console.log('Fetched files:', filesData);
            setFiles(filesData.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const coursesData = await apiService.fetchCourses();
            console.log('Fetched courses:', coursesData);
            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchDiscussionsFromApi(searchTerm);
    }, [searchTerm]);

    const fetchDiscussionsFromApi = async (term = '') => {
        try {
            let response;
            if (term) {
                response = await apiService.searchDiscussions(term);
            } else {
                response = await apiService.fetchDiscussions();
                console.log('Expected response structure:', response);
            }
            if (response && response.discussion && response.replies) {
                const discussionsWithRepliesCount = response.discussion.map(discussion => {
                    const repliesCount = response.replies.filter(reply => reply.discussion_id === discussion.id).length;
                    return { ...discussion, repliesCount };
                });
                setDiscussions(discussionsWithRepliesCount);
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };

    const handleDiscussionClick = (id) => {
        navigate(`/discussion/${id}`);
    };

    const handleTabClick = (tab) => setActiveTab(tab);
    const closeModal = () => props.setModal(false);

    // Typing Speed Handlers
    const handleFocus = () => {
        // Calculate time away if the text area was unfocused
        if (lastBlurTime) {
            const now = new Date();
            setFocusAwayTime(prev => prev + (now - lastBlurTime));
        }
        setStartTime(new Date()); // Set or reset start time on focus
        setLastBlurTime(null); // Reset last blur time as the user is now focused
    };

    const handleBlur = () => {
        const endTime = new Date();
        setElapsedTime(prev => prev + (endTime - startTime)); // Update elapsed typing time
        setStartTime(null); // Clear start time
        setLastBlurTime(endTime); // Set last blur time to track focus away time
    };

    const handleInput = (event) => {
        const textLength = event.target.value.length;
        setTypedCharacters(textLength);

        // Calculate real-time typing speed based on current total elapsed time
        const now = new Date();
        const totalElapsedTime = elapsedTime + (now - startTime); // Total typing time

        // Words per minute calculation
        const timeDiffInMinutes = totalElapsedTime / (1000 * 60);
        const wordsTyped = textLength / 5;
        const wpm = Math.round(wordsTyped / timeDiffInMinutes);

        // Update typing speed in real time
        setTypingSpeed(wpm);
    };

    return (
        <div className="instructor-landing-page">


            {props.modalOpen && (
                <Modal toggleModal={() => props.toggleModal()} modalType={props.modalType} />
            )}

            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tab1')}
                >
                    Content
                </button>
                <button
                    className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tab2')}
                >
                    Discussions
                </button>
                <div className='hamburger-menu-container'>
                    <IconButton
                        edge="end"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        className="hamburger-menu"
                    >
                    <MenuIcon />
                    </IconButton>
                    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <div
                            className="drawer-content"
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                        >
                            {list()}
                        </div>
                    </Drawer>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === 'tab1' ? (
                    <div>
                        <PhotoCarousel photos={files} />
                        <CoursesCarousel courses={courses} />
                        <FilesCarousel files={files} />
                    </div>
                ) : (
                    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
                        {discussions.map((discussion) => (
                            <Paper key={discussion.id} elevation={2} sx={{ p: 2, mb: 2, cursor: 'pointer' }}
                                   onClick={() => handleDiscussionClick(discussion.id)}>
                                <Typography variant="h6" sx={{ mb: 1 }}>{discussion.title}</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>{discussion.content}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ThumbUpAltIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                                    <Typography sx={{ mx: 2 }}>{discussion.likes}</Typography>
                                    <ThumbDownAltIcon sx={{ mr: 0.5, color: 'secondary.main' }} />
                                    <Typography sx={{ mx: 2 }}>{discussion.dislikes}</Typography>
                                    <CommentIcon sx={{ ml: 2, mr: 0.5, color: 'action.active' }} />
                                    <Typography>{discussion.repliesCount}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </div>

            {/* Typing Speed Section */}
            {/* <div className="typing-speed-section">
                <h2 className="section-heading">Typing Speed Test</h2>
                <textarea
                    rows="5"
                    cols="40"
                    placeholder="Start typing..."
                    onFocus={handleFo   cus}
                    onInput={handleInput}
                    onBlur={handleBlur}
                ></textarea>
                {typingSpeed !== null && (
                    <p>Typing speed: {typingSpeed} words per minute</p>
                )}
                <p>Focus away time: {(focusAwayTime / 1000).toFixed(2)} seconds</p>
            </div> */}
        </div>
    );
};

export default InstructorLandingPage;
