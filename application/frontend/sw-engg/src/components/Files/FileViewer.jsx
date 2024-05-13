import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FileViewer = ({ fileUrl, fileType }) => {
  // Function to render different types of files
  const renderFile = () => {
    const fileExtension = getFileExtension(fileUrl); // Get file extension

    switch (fileType) {
      case 'image':
        return <img src={fileUrl} alt="Displayed content" style={{ maxWidth: '100%' }} />;
      case 'video':
        return <video controls style={{ maxWidth: '100%' }}><source src={fileUrl} type={`video/${fileExtension}`} /></video>;
      case 'audio':
        return <audio controls style={{ maxWidth: '100%' }}><source src={fileUrl} type={`audio/${fileExtension}`} /></audio>;
      case 'pdf':
        return <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} title="PDF Viewer"></iframe>;
      case 'text':
        return <TextFileViewer fileUrl={fileUrl} />;
      default:
        return <div>Unsupported file type</div>;
    }
  };

  // Extract file extension from URL
  const getFileExtension = (url) => {
    return url.split('.').pop();
  };

  return (
    <div className="file-viewer">
      {fileUrl ? renderFile() : <div>Loading file...</div>}
    </div>
  );
};

// Component to handle text file viewing with syntax highlighting
const TextFileViewer = ({ fileUrl }) => {
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTextContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setTextContent(text);
      } catch (error) {
        console.error('Error fetching text content:', error);
        setError('Failed to load text content');
      } finally {
        setLoading(false);
      }
    };

    fetchTextContent();
  }, [fileUrl]);

  if (loading) {
    return <div>Loading text content...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SyntaxHighlighter language="plaintext" style={vscDarkPlus}>
      {textContent}
    </SyntaxHighlighter>
  );
};

export default FileViewer;

