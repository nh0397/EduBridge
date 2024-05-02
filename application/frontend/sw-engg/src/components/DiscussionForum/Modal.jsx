// Modal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';
import {
  Grid, Paper, Box, Typography, TextField, Button,
  Checkbox, FormControlLabel,
  InputAdornment, IconButton
} from '@mui/material';
import backgroundImage from '../../images/Backgroundimage.png';
import apiService from '../../services/apiService';

function Modal(props) {
    const navigate = useNavigate();
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


    const submitPost = async () =>{
         try {
            const userEmail = sessionStorage.getItem('userEmail');
            const data = await apiService.createDiscussion(title, description, userEmail);
            if (data) {
                navigate('/discussion/${data.id}');
                props.toggleModal()
            }
        } catch (error) {
            console.error('Error creating discussion:', error);        
    }
}
    const isSubmitDisabled = title.length > 0 && title.length < 255 && description.length > 0;

    return (
        <div className="modal-overlay" onClick={()=> props.toggleModal}>
            {props.modalType ==='Discussions' ? (
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h2 >Add Post</h2>
                </div>
                <div className="input-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={title} onChange={handleTitleChange} />
                    <div className='title-box '>
                        <span className="character-count">{title.length} characters</span>
                        {title.length > 255 && (
                        <span className="character-count red-color">Keep the characters below 255</span>
                        )}
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description:</label>
                    <textarea className='text-area' id="description" value={description} onChange={handleDescriptionChange} />
                    <span className="character-count">{description.length} characters</span>
                </div>
                <div className='buttonDiv'>
                    <Button onClick={submitPost} disabled={!isSubmitDisabled} className='sign-in' sx={{ mt: 7.95}} variant="contained">
                        Post
                    </Button>
                    <Button onClick={()=> props.toggleModal()} className='sign-in' sx={{ mt: 7.95}} variant="contained">
                        Cancel
                    </Button>
                </div>
            </div>
            ) : (
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h2 >Upload File</h2>
                </div>
               <form>
                    <div>
                    <input type="file" />
                    </div>
                    <div>
                    <input type="text" placeholder="Enter the path" />
                    </div>
                    <button type="submit">Upload File</button>
                </form>
                <div className='buttonDiv'>
                    <Button className='sign-in' sx={{ mt: 7.95}} variant="contained">
                        Post
                    </Button>
                    <Button onClick={()=> props.toggleModal()} className='sign-in' sx={{ mt: 7.95}} variant="contained">
                        Cancel
                    </Button>
                </div>
            </div>
            )}
        </div>
    );
}

export default Modal;
