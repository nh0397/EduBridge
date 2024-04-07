import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadContentPage.css'; 

const UploadContentPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleTagsChange = (e) => setTags(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare the data to be sent to the backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    
    // TODO: Post formData to the backend
    console.log('File and details ready to be sent to the backend');
  };

  return (
    <div className="upload-content">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the file here ...</p> :
            <p>Drag & drop a file here, or click to select file</p>
        }
      </div>
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" onChange={handleTitleChange} />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" onChange={handleDescriptionChange}></textarea>

        <label htmlFor="tags">Tags</label>
        <input id="tags" name="tags" type="text" onChange={handleTagsChange} />

        <button type="submit">Done</button>
      </form>
    </div>
  );
};

export default UploadContentPage;
