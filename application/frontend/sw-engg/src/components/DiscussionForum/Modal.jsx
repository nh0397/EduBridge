// Modal.jsx
import React, { useState } from 'react';
import './Modal.css';
import {
  Grid, Paper, Box, Typography, TextField, Button,
  Checkbox, FormControlLabel,
  InputAdornment, IconButton
} from '@mui/material';
import backgroundImage from '../../images/Backgroundimage.png';


function Modal(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageError, setImageError] = useState(false);

    const handleTitleChange = (event) => {
        const value = event.target.value;
        setTitle(value);
    };

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value);
    };

    const handleImageUrlChange = (event) => {
        const url = event.target.value;
        setImageUrl(url);
        // Check if the URL is valid
        const img = new Image();
        img.onload = () => setImageError(false);
        img.onerror = () => setImageError(true);
        img.src = url;
    };

  
    const isSubmitDisabled = title.length < 30 || description.length < 250 || !imageUrl || imageError;

    return (
        <div className="modal-overlay" onClick={()=> props.toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h2 >Add Post</h2>
                </div>
                <div className="input-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={title} onChange={handleTitleChange} />
                    <span className="character-count">{title.length}/30</span>
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={handleDescriptionChange} />
                    <span className="character-count">{description.length}/250</span>
                </div>
                <div className='buttonDiv'>
                    <Button className='sign-in' sx={{ mt: 7.95}} variant="contained">
                        Post
                    </Button>
                    <Button onClick={()=> props.toggleModal()} className='sign-in' sx={{ mt: 7.95}} variant="contained">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
