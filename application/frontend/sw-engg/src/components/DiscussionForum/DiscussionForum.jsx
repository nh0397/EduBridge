import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Box, Button, TextField, Typography } from "@mui/material";

const DiscussionForum = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const navigate = useNavigate();

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setError('');
        setConfirmation('');
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.length > 150) {
            setError('Title must be less than 150 characters.');
            return;
        }
        if (!title.trim() || !text.trim()) {
            setError('Please enter a title and text for the discussion.');
            return;
        }

        try {
            const userEmail = sessionStorage.getItem('userEmail');
            const data = await apiService.createDiscussion(title, text, userEmail);
            if (data) {
                setConfirmation('Discussion created successfully!');
                navigate(`/discussion/${data.id}`);
                onClose();
            }
        } catch (error) {
            console.error('Error creating discussion:', error);
            setError(error.message || 'Failed to create discussion.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 'auto',
                marginTop: 3,
                maxWidth: 500,
                width: '100%'
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Create post</Typography>
            {error && <Typography color="error">{error}</Typography>}
            {confirmation && <Typography color="primary">{confirmation}</Typography>}
            <TextField
                required
                label="Title"
                variant="outlined"
                value={title}
                onChange={handleTitleChange}
                sx={{ width: '100%', marginBottom: 2 }}
            />
            <TextField
                label="Body"
                multiline
                rows={4}
                variant="outlined"
                value={text}
                onChange={handleTextChange}
                sx={{ width: '100%', marginBottom: 2 }}
            />
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    marginBottom: 2
                }}
            >
                <Button variant="contained" color="primary" onClick={handleSubmit}>Post</Button>
            </Box>
        </Box>
    );
};

export default DiscussionForum;
