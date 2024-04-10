import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './InstructorLandingPage.css'; // CSS needs work

import apiService from "../../../services/apiService";

const DashboardOverview = () => <div className="dashboard-overview">Dashboard Overview Content</div>;
const CourseManagementTools = () => <div className="course-management-tools">Course Management Tools Content</div>;
const EngagementInsights = () => <div className="engagement-insights">Engagement Insights Content</div>;

// Assuming these components are similar or can be shared
const FileView = () => <div>File View Placeholder</div>;
const Conversations = () => <div>Conversations Placeholder</div>;

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

const UploadContent = () => {
  // This component will handle the file upload feature unique to instructors
  const navigate = useNavigate();

  const goToUploadContent = () => {
    navigate('/upload-content'); // Ensure this route is set up in your routing configuration
  };

  return (
    <div className="upload-content">
      <button onClick={goToUploadContent}>Upload New Content</button>
    </div>
  );
};

const InstructorLandingPage = () => {
  const [files, setFiles] = useState([]); // Reusing the state logic for files

  useEffect(() => {
    const fetchFilesData = async () => {
      try {
        const filesData = await apiService.fetchFiles(); // Assuming instructors might want to see certain files
        setFiles(filesData.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFilesData();
  }, []);

  return (
    <div className="instructor-landing-page">
      <header className="instructor-header">
        <h1>Instructor Dashboard</h1>
      </header>
      
      <DashboardOverview />
      <CourseManagementTools />
      <EngagementInsights />

      {/* Featured Courses Section */}
      <section className="featured-courses">
        <h3>Featured Courses</h3>
        <FeaturedCoursesCarousel files={files} />
      </section>
      
      {/* Upload Content Section */}
      <UploadContent />
      
      <footer className="instructor-footer">
        <p>© 2024 Your Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InstructorLandingPage;

