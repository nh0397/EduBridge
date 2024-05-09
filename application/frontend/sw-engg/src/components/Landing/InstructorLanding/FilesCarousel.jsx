import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiService from '../../../services/apiService';

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", left: 25, zIndex: 1 }}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faChevronLeft} />
        </div>
    );
};

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", right: 25, zIndex: 1 }}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faChevronRight} />
        </div>
    );
};

const PopularFilesCarousel = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const filesData = await apiService.fetchAllFiles();
                setFiles(filesData.data);
            } catch (error) {
                console.error('Error fetching files:', error);
                // Display error message to the user
            }
        };

        fetchFiles();
    }, []);

    const settings = {
        dots: true,
        zIndex: -1,
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
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <Slider {...settings}>
            {files.map((file) => (
                <div key={file.id} className="file-card">
                    <img src={file.thumbnail} alt={file.title} className="file-thumbnail" />
                    <div className="file-info">
                        <h3>{file.title}</h3>
                        <p>{file.description}</p>
                        <div className="file-meta">
                            <span>{file.category}</span>
                            <span>{file.fileSize}</span>
                            <span>{file.uploadDate}</span>
                        </div>
                    </div>
                </div>
            ))}
        </Slider>
    );
};

export default PopularFilesCarousel;
