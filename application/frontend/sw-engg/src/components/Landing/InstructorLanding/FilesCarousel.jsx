import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { faChevronLeft, faChevronRight, faInfoCircle, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiService from '../../../services/apiService';
import './FilesCarousel.css'; // Ensure you import your CSS file
import {
    faFilePdf,
    faFileWord,
    faFileExcel,
    faFileImage,
    faFileVideo,
    faFileAudio,
    faFile
} from '@fortawesome/free-solid-svg-icons';

const getFileIcon = (filename_download) => {
    const fileExtension = filename_download.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'pdf':
            return faFilePdf;
        case 'doc':
        case 'docx':
            return faFileWord;
        case 'xls':
        case 'xlsx':
            return faFileExcel;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return faFileImage;
        case 'mp4':
        case 'avi':
        case 'mov':
            return faFileVideo;
        case 'mp3':
        case 'wav':
        case 'aac':
            return faFileAudio;
        default:
            return faFile; // Generic file icon for unknown types
    }
};

const PrevArrow = ({ className, style, onClick }) => (
    <div className={className} style={{ ...style, display: "block", left: 25, zIndex: 1 }} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
    </div>
);

const NextArrow = ({ className, style, onClick }) => (
    <div className={className} style={{ ...style, display: "block", right: 25, zIndex: 1 }} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} />
    </div>
);

const Modal = ({ file, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <span className="close-button" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></span>
            <p>{file.description}</p>
        </div>
    </div>
);

const PopularFilesCarousel = () => {
    const [files, setFiles] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const filesData = await apiService.fetchAllFiles();
                setFiles(filesData.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    const handleInfoClick = (file) => {
        setSelectedFile(file);
        setModalOpen(true);
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 }
            }
        ]
    };

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {files.map((file) => (
                    <div key={file.id} className="file-card">
                        <div className="file-info">
                            <div className="file-title-container">
                                <FontAwesomeIcon icon={getFileIcon(file.filename_download)} className="file-icon" />
                                <h3 className="file-title">{file.title}</h3>
                            </div>
                            {selectedFile && selectedFile.id === file.id && (
                                <div className="description-preview">
                                    <p>{file.description}</p>
                                </div>
                            )}
                            <div className="file-details">
                                <p className="author-name">Author: {file.user_name}</p>
                                <p className="modified-date">Modified on: {new Date(file.modified_on).toLocaleString()}</p>
                                <div className="action-buttons">
                                    <button className="info-button" onClick={() => handleInfoClick(file)}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                    </button>
                                    <a href={file.downloadUrl} className="download-link">
                                        <FontAwesomeIcon icon={faDownload} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {modalOpen && <Modal file={selectedFile} onClose={() => setModalOpen(false)} />}
        </div>
    );
};

export default PopularFilesCarousel;
