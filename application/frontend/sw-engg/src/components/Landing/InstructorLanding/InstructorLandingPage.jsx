import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructorLandingPage.css';  // Ensure your CSS path is correct
import Modal from '../../DiscussionForum/Modal';
import apiService from '../../../services/apiService';
import { Box, Paper, Typography } from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentIcon from '@mui/icons-material/Comment';
import PhotoCarousel from './PhotoCarousel'; // Make sure you have this component properly set up

const InstructorLandingPage = (props) => {
    const [files, setFiles] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const navigate = useNavigate();
    const role = sessionStorage.getItem('role'); // Fetching role from sessionStorage

    const fetchFiles = async () => {
        try {
            const filesData = await apiService.fetchAllFiles();
            setFiles(filesData.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
        fetchDiscussionsFromApi();
    }, []);

    const fetchDiscussionsFromApi = async () => {
        try {
            const response = await apiService.fetchDiscussions();
            if (response && response.discussion && response.replies) {
                const discussionsWithRepliesCount = response.discussion.map(discussion => {
                    const repliesCount = response.replies.filter(reply => reply.discussion_id === discussion.id).length;
                    return {...discussion, repliesCount};
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

    const [activeTab, setActiveTab] = useState('tab1');
    const handleTabClick = (tab) => setActiveTab(tab);
    const closeModal = () => props.setModal(false);

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
            </div>

            <div className="tab-content">
                {activeTab === 'tab1' ? (
                    <div>
                        {role === 'Student' && (
                            <PhotoCarousel photos={[
                        ]} />
                    )}
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
                                    <Typography sx={{ mx: 2 }}>{discussion.likes - discussion.dislikes}</Typography>
                                    <ThumbDownAltIcon sx={{ mr: 0.5, color: 'secondary.main' }} />
                                    <CommentIcon sx={{ ml: 2, mr: 0.5, color: 'action.active' }} />
                                    <Typography>{discussion.repliesCount}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </div>
        </div>
    );
};

export default InstructorLandingPage;