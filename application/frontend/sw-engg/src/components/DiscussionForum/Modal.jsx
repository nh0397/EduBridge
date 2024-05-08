import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import './Modal.css';
import apiService from '../../services/apiService';

function Modal(props) {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileDescription, setFileDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleFileNameChange = (event) => {
        setFileName(event.target.value);
    };

    const handleFileDescriptionChange = (event) => {
        setFileDescription(event.target.value);
    };

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const submitPost = async () => {
        try {
            const userEmail = sessionStorage.getItem('userEmail');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('userEmail', userEmail);
            formData.append('fileName', fileName);
            formData.append('fileDescription', fileDescription);
            files.forEach(file => {
                formData.append('files', file);
            });

            const data = await apiService.createDiscussion(formData);
            if (data) {
                navigate(`/discussion/${data.id}`);
                props.toggleModal();
            }
        } catch (error) {
            console.error('Error creating discussion:', error);
            setError('Failed to create discussion. Please try again.');
        }
    };

    const isSubmitDisabled = props.modalType === 'Discussions' ?
        !(title.length > 0 && description.length > 0) :
        !(fileName.length > 0 && fileDescription.length > 0 && files.length > 0);

    return (
        <div className="modal-overlay" onClick={() => props.toggleModal()}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{props.modalType === 'Discussions' ? 'Add Post' : 'Upload File'}</h2>
                {props.modalType === 'Discussions' ? (
                    <>
                        <TextField label="Title" value={title} onChange={handleTitleChange} fullWidth margin="normal" />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={handleDescriptionChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                    </>
                ) : (
                    <>
                        <TextField label="File Name" value={fileName} onChange={handleFileNameChange} fullWidth margin="normal" />
                        <TextField
                            label="File Description"
                            value={fileDescription}
                            onChange={handleFileDescriptionChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                <p>Drop the files here...</p> :
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            }
                        </div>
                        {files.length > 0 && <p>Uploaded file: {files[0].name}</p>}
                    </>
                )}
                <div className='buttonDiv'>
                    <Button onClick={submitPost} disabled={isSubmitDisabled} variant="contained">
                        {props.modalType === 'Discussions' ? 'Post' : 'Upload'}
                    </Button>
                    <Button onClick={() => props.toggleModal()} variant="contained">
                        Cancel
                    </Button>
                </div>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Modal;
