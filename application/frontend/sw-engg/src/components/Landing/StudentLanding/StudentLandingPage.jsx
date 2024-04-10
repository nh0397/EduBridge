import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './StudentLandingPage.css'; // CSS file
import apiService from '../../../services/apiService';
import FileView from './FileView';
import Conversations from './Conversations';

const FeaturedCoursesCarousel = ({ files }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  if (!Array.isArray(files)) {
    return <div>No files available</div>;
  }

  return (
    <Slider {...settings}>
      {files.map((file) => (
        <div key={file.id}>
          <h3>{file.title}</h3>
          <p>{file.description}</p>
        </div>
      ))}
    </Slider>
  );
};

const StudentLandingPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); // State variable to store files

  useEffect(() => {
    // Fetch files when the component mounts
    const fetchFilesData = async () => {
      try {
        const filesData = await apiService.fetchFiles();
        setFiles(filesData.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFilesData();
  }, []); 

  const exploreCourses = () => {
    navigate('/courses'); // Adjust as necessary based on the app's routes
  };

  const startDiscussion = () => {
    navigate('/discussion/new'); // Example route, adjust as necessary
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to Your Learning Platform</h1>
      </header>

      <section className="welcome-section">
        <h2>Welcome, Students!</h2>
        <p>Explore your courses, connect in conversations, and enhance your learning journey with us.</p>
        <button onClick={exploreCourses}>Explore Courses</button>
      </section>

      <main className="split-view">
        <FileView />
        <Conversations />
        <button onClick={startDiscussion}>Start a New Discussion</button>
      </main>

      <section className="featured-courses">
        <h3>Featured Courses</h3>
        <FeaturedCoursesCarousel files={files} />
      </section>



      <footer className="landing-footer">
        <p>© 2024 Your Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentLandingPage;
