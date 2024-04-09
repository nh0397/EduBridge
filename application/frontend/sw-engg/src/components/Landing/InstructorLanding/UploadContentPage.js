import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadContentPage.css';
import apiService from '../../../services/apiService';

const UploadContentPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [parentFolders, setParentFolders] = useState([]);
  const [childFolders, setChildFolders] = useState([]);

  useEffect(() => {
    const fetchParentFolders = async () => {
      try {
        const folders = await apiService.fetchFolders();
        const parentFolders = folders.filter(folder => folder.parent === null);
        setParentFolders(parentFolders);
      } catch (error) {
        console.error('Error fetching parent folders:', error);
      }
    };
    fetchParentFolders();
  }, []);

  const fetchChildFolders = async () => {
    try {
      const folders = await apiService.fetchFolders();
      const selectedFolder = folders.find(folder => folder.id === selectedParent);
      if (selectedFolder) {
        const children = folders.filter(folder => folder.parent === selectedFolder.id);
        setChildFolders(children);
      }
    } catch (error) {
      console.error('Error fetching child folders:', error);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleParentChange = (e) => {
    setSelectedParent(e.target.value);
    fetchChildFolders();
  };

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
        <label htmlFor="parentFolder">Parent Folder</label>
        <select id="parentFolder" onChange={handleParentChange} value={selectedParent}>
          <option value="">Select Parent Folder</option>
          {parentFolders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
        
        {selectedParent && (
          <div>
            <label htmlFor="childFolder">Child Folder</label>
            <select id="childFolder" value="">
              <option value="">Select Child Folder</option>
              {childFolders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
        )}

        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" onChange={handleTitleChange} />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" onChange={handleDescriptionChange}></textarea>

        <label htmlFor="tags">Tags</label>
        <input id="tags" name="tags" type="text" onChange={handleTagsChange} />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadContentPage;
