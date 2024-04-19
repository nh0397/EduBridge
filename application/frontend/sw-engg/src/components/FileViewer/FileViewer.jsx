import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can choose a different theme if you prefer

const FileViewer = ({ fileUrl, fileType }) => {
  // Function to render different types of files
  const renderFile = () => {
    // Determine the file type based on the extension or metadata
    const fileExtension = getFileExtension(fileUrl);

    // Render the appropriate viewer based on the file type
    switch (fileType) {
      case 'image':
        return <img src={fileUrl} alt="File" />;
      case 'video':
        return <video controls><source src={fileUrl} type={`video/${fileExtension}`} /></video>;
      case 'audio':
        return <audio controls><source src={fileUrl} type={`audio/${fileExtension}`} /></audio>;
      case 'text':
        // For text files, render using the TextFileViewer component
        return <TextFileViewer fileUrl={fileUrl} />;
      default:
        return <div>Unsupported file type</div>;
    }
  };

  // Function to extract file extension from URL
  const getFileExtension = (url) => {
    const segments = url.split('.');
    return segments[segments.length - 1];
  };

  return (
    <div className="file-viewer">
      {fileUrl ? renderFile() : <div>Loading...</div>}
    </div>
  );
};

// Text file viewer component
const TextFileViewer = ({ fileUrl }) => {
  // State to store the text content of the file
  const [textContent, setTextContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  // Fetch the text content of the file
  React.useEffect(() => {
    const fetchTextContent = async () => {
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setTextContent(text);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching text content:', error);
      }
    };

    fetchTextContent();
  }, [fileUrl]);

  return (
    <div className="text-file-viewer">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <SyntaxHighlighter language="plaintext" style={vscDarkPlus}>
          {textContent}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default FileViewer;
