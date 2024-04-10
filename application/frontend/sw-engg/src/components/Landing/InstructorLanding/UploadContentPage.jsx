import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./UploadContentPage.css";
import apiService from "../../../services/apiService";

const UploadContentPage = () => {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState(""); // Added state for selectedChild
  const [parentFolders, setParentFolders] = useState([]);
  const [folderMappings, setFolderMappings] = useState({});

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const folders = await apiService.fetchFolders();
        const parentFolders = folders.filter(
          (folder) => folder.parent === null
        );
        setParentFolders(parentFolders);

        // Fetch mappings of parent folders and their children
        const mappings = {};
        parentFolders.forEach((parent) => {
          const children = folders.filter(
            (folder) => folder.parent === parent.id
          );
          mappings[parent.id] = children;
        });
        setFolderMappings(mappings);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };
    fetchFolders();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setUploadedFileName(uploadedFile.name);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleParentChange = (e) => {
    setSelectedParent(e.target.value);
    // Clear selected child when parent changes
    setSelectedChild("");
  };

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault(); // Prevent form submission
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (
    !file ||
    !title.trim() ||
    !description.trim() ||
    tags.length === 0 ||
    !selectedParent ||
    !selectedChild
  ) {
    // Don't proceed if any required field is missing
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("folderId", selectedChild);

    const response = await apiService.uploadFile(formData);
    console.log(response.data);
    alert('File uploaded successfully');

    // Clear the form fields after successful upload
    setFile(null);
    setUploadedFileName("");
    setTitle("");
    setDescription("");
    setTagInput("");
    setTags([]);
    setSelectedParent("");
    setSelectedChild("");
  } catch (error) {
    console.error('Upload error:', error);
    alert('File upload failed');
  }
};


  const isUploadDisabled =
    !file ||
    !title.trim() ||
    !description.trim() ||
    tags.length === 0 ||
    !selectedParent ||
    !selectedChild;

  return (
    <div className="upload-content">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <>
            <p>Drag & drop a file here, or click to select file</p>
            {uploadedFileName && <p>Uploaded file: {uploadedFileName}</p>}
          </>
        )}
      </div>
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="parentFolder">
          Parent Folder<span>*</span>
        </label>
        <select
          id="parentFolder"
          onChange={handleParentChange}
          value={selectedParent}
        >
          <option value="">Select Parent Folder</option>
          {parentFolders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>

        {selectedParent && folderMappings[selectedParent] && (
          <div>
            <label htmlFor="childFolder">
              Child Folder<span>*</span>
            </label>
            <select
              id="childFolder"
              onChange={handleChildChange}
              value={selectedChild}
            >
              <option value="">Select Child Folder</option>
              {folderMappings[selectedParent].map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <label htmlFor="title">
          Title<span>*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />

        <label htmlFor="description">
          Description<span>*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>

        <label htmlFor="tags">Tags</label>
        <div>
          <input
            id="tags"
            name="tags"
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="tags-container">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              {tag}
              <button onClick={() => handleDeleteTag(index)}>x</button>
            </div>
          ))}
        </div>

        {isUploadDisabled && (
          <div className="message">Please fill in all required fields</div>
        )}

        <button type="submit" disabled={isUploadDisabled}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadContentPage;
