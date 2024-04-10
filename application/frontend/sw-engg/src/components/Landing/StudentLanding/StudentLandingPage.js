import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './StudentLandingPage.css'; // CSS file needs to be updated

// Placeholder Components
const FileView = () => <div>File View Placeholder</div>;
const Conversations = () => <div>Conversations Placeholder</div>;

const FeaturedCoursesCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  // Sample courses data
  const courses = [
    { id: 1, title: 'Mastering React: From Beginner to Pro', description: 'Dive deep into React...' },
    { id: 2, title: 'The Ultimate Guide to Node.js', description: 'Unlock the full potential of Node.js...' },
  ];

  return (
    <Slider {...settings}>
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
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

      <Link to="/forum" className="nav-link">Go to Discussion Forum</Link>

      <section className="featured-courses">
        <h3>Featured Courses</h3>
        <FeaturedCoursesCarousel />
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



