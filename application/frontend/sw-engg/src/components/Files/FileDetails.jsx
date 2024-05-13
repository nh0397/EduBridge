import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/apiService'; // Ensure this path is correct

const FileDetails = () => {
    const { id } = useParams(); // Get the file ID from URL parameters
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      console.log(id)  
        const fetchFileMetadata = async () => {
            try {
                const data = await apiService.fetchFileMetadata(id); // Make sure this method is implemented in your API service
                setFile(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching file details:', err);
            }
            setIsLoading(false);
        };

        fetchFileMetadata();
    }, [id]); // Dependency array ensures this effect runs only when fileId changes

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading file: {error}</p>;

    return (
        <div>
            <h1>File Details</h1>
            {file ? (
                <div>
                    <h2>{file.title}</h2>
                    <p>{file.description}</p>
                    {/* Add more details as needed */}
                    {/* FileViewer component to view the file if it's an image, video, etc. */}
                </div>
            ) : (
                <p>No file found.</p>
            )}
        </div>
    );
};

export default FileDetails;

