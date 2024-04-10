import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './StudentLandingPage.css'; // CSS file needs to be updated
import  apiService  from '../../../services/apiService'; // Import the fetchFiles API service

// Placeholder Components
const FileView = () => <div>File View Placeholder</div>;
const Conversations = () => <div>Conversations Placeholder</div>;

const FeaturedCoursesCarousel = ({ files }) => {
  console.log("type of ", typeof(files), files)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

      // Check if files is not an array
  if (!Array.isArray(files)) {
    return <div>No files available</div>;
  }

  return (
    <Slider {...settings}>
      {files.map((file) => (
        <div key={file.id}>
          <h3>{file.title}</h3> {/* Display file title */}
          <p>{file.description}</p> {/* Display file description */}
        </div>
      ))}
    </Slider>
  );
};



// Additional feature can be removed
const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');

  const submitFeedback = () => {
    console.log(feedback);
    //  feedback logic here
    setFeedback(''); // Reset feedback input
  };

  return (
    <div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Suggest a course or feature..."
      />
      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
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
  }, []); // Run only once when the component mounts

  const exploreCourses = () => {
    navigate('/courses');
  };

  const startDiscussion = () => {
    console.log("Redirect to start a new discussion form/page.");
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
        <FeaturedCoursesCarousel files={files} /> {/* Pass files as props */}
      </section>

      <section className="feedback-section">
        <h3>Your Feedback</h3>
        <FeedbackForm />
      </section>

      <footer className="landing-footer">
        <p>© 2024 Your Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentLandingPage;
