import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faUpload, faComments } from '@fortawesome/free-solid-svg-icons';


import apiService from '../../../services/apiService'; // Ensure the correct path

const PopularFilesCarousel = ({ files }) => {
  // Same settings as in StudentLandingPage
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
        breakpoint: 768, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480, // Adjust breakpoint as needed
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

const InstructorLandingPage = () => {
  const [files, setFiles] = useState([]);
  const Name = sessionStorage.getItem('firstName'); // Fetch the name from sessionStorage

  const fetchFiles = async () => {
    try {
      const filesData = await apiService.fetchAllFiles();
      setFiles(filesData.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      // Display error message to the user
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="instructor-landing-page">
      <section className="instructions-section">
        <h2>Getting Started</h2>
        <p>Manage your courses, engage with students, and track progress using the tools provided:</p>
        <ul>
          <li><FontAwesomeIcon icon={faUpload} /> Upload new course content</li> {/* Added upload icon */}
          <li><FontAwesomeIcon icon={faComments} /> Participate in discussions</li> {/* Added comments/discussion icon */}
        </ul>
      </section>

      <section className="featured-courses">
        <h3>Popular Files</h3>
        <PopularFilesCarousel files={files} />
      </section>

      <footer className="instructor-footer">
        <p>© 2024 Your Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Custom arrow components for Slider
const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  );
};

export default InstructorLandingPage;





