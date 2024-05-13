import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import FileViewer from 'react-file-viewer';
import apiService from '../../services/apiService'; // Ensure this path is correct
import config from '../../config'; // Import the configuration

const FileDetails = () => {
    const { id } = useParams(); // Get the file ID from URL parameters
    const [fileUrl, setFileUrl] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewerError, setViewerError] = useState(null);

    const supportedDocViewerTypes = ['pdf', 'html'];
    const supportedFileViewerTypes = ['docx', 'xlsx', 'pptx', 'txt', 'csv', 'md', 'jpeg', 'jpg', 'png', 'gif', 'mp4'];

    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                // Fetch file metadata
                const metadata = await apiService.fetchFileMetadata(id);
                const { filename_disk } = metadata;
                const extension = filename_disk.split('.').pop().toLowerCase();
                setFileType(extension);

                // Fetch file URL
                const url = `${config.BASE_URL}/file-url/${id}`;
                setFileUrl(url);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching file details:', err);
            }
            setIsLoading(false);
        };

        fetchFileDetails();
    }, [id]); // Dependency array ensures this effect runs only when fileId changes

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading file: {error}</p>;

    const documents = [{ uri: fileUrl }];

    return (
        <div>
            <h1>File Details</h1>
            {fileUrl ? (
                <div style={{ width: '800px', height: '600px', margin: 'auto' }}>
                    {supportedDocViewerTypes.includes(fileType) ? (
                        <DocViewer 
                            documents={documents} 
                            pluginRenderers={DocViewerRenderers}
                            style={{ width: '100%', height: '100%' }}
                            onError={(e) => {
                                console.error('Error in DocViewer:', e);
                                setViewerError('docviewer');
                            }}
                        />
                    ) : supportedFileViewerTypes.includes(fileType) ? (
                        <FileViewer
                            fileType={fileType}
                            filePath={fileUrl}
                            onError={(e) => {
                                console.error('Error in FileViewer:', e);
                                setViewerError('fileviewer');
                            }}
                        />
                    ) : (
                        <div>
                            <p>Can't view this file type here. Work in progress for this file extension.</p>
                            <a href={fileUrl} download>Download the file</a>
                        </div>
                    )}
                    {viewerError && (
                        <div>
                            <p>Can't view this file type here. Work in progress for this file extension.</p>
                            <a href={fileUrl} download>Download the file</a>
                        </div>
                    )}
                </div>
            ) : (
                <p>No file found.</p>
            )}
            <div>
                <a href={fileUrl} download>Download the file</a>
            </div>
        </div>
    );
};

export default FileDetails;
