import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AssignmentPage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import io from "socket.io-client";
import assignmentQuestions from './assignmentQuestions';
import Chatbot from '../Chatbot/chatbot';
import VideoAnalytics from '../videoAnalytics/videoAnalytics';

// WebSocket instance
const socket = io("http://localhost:3001");

// EULA Component
const EndUserLicenseAgreement = ({ onAgree, onDisagree }) => {
  return (
    <div className="eula-overlay">
      <div className="eula-container">
        <h2>End User License Agreement</h2>
        <p>
          By using this application, you acknowledge and agree to the following:
        </p>
        <ul>
          <li>
            <strong>Video Data:</strong> Your video feed may be analyzed to
            detect emotions and behaviors to enhance your learning experience.
          </li>
          <li>
            <strong>Textual Data:</strong> Text you type in response to
            assignments is analyzed to provide feedback and improve metrics like
            typing speed and error count.
          </li>
        </ul>
        <p>
          This data is used solely for improving your experience and will not
          be shared with third parties without your consent.
        </p>
        <div className="eula-buttons">
          <button onClick={onAgree} className="eula-agree-button">I Agree</button>
          <button onClick={onDisagree} className="eula-disagree-button">I Disagree</button>
        </div>
      </div>
    </div>
  );
};

const assignmentsData = assignmentQuestions;

const AssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignment = assignmentsData[id];

  // EULA State
  const [hasAgreedToEULA, setHasAgreedToEULA] = useState(() => {
    const savedAgreement = localStorage.getItem('hasAgreedToEULA');
    if (savedAgreement === 'true') return true;
    if (savedAgreement === 'false') return false;
    return null; // No agreement state saved
  });

  const handleEULAAgreement = () => {
    localStorage.setItem('hasAgreedToEULA', 'true');
    setHasAgreedToEULA(true);
  };

  const handleEULADisagreement = () => {
    localStorage.setItem('hasAgreedToEULA', 'false');
    setHasAgreedToEULA(false);
  };

  // Metrics
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timePaused, setTimePaused] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [blinkChatbot, setBlinkChatbot] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const isAnyFocusedRef = useRef(false);
  const isTabActiveRef = useRef(true);
  const elapsedTimerRef = useRef(null);
  const pausedTimerRef = useRef(null);
  const stateRef = useRef({
    timeElapsed,
    timePaused,
    typingSpeed,
    tabSwitchCount,
    errorCount,
    totalWordsTyped,
  });

  // Sync state with refs
  useEffect(() => {
    stateRef.current = {
      timeElapsed,
      timePaused,
      typingSpeed,
      tabSwitchCount,
      errorCount,
      totalWordsTyped,
    };
  }, [timeElapsed, timePaused, typingSpeed, tabSwitchCount, errorCount, totalWordsTyped]);

  // Send metrics periodically
  useEffect(() => {
    if (hasAgreedToEULA) {
      const interval = setInterval(() => {
        socket.emit("time-message", { ...stateRef.current });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [hasAgreedToEULA]);

  // Typing speed calculation
  useEffect(() => {
    if (timeElapsed > 0) {
      const wpm = Math.floor((totalWordsTyped / timeElapsed) * 60);
      setTypingSpeed(wpm);
    }
  }, [timeElapsed, totalWordsTyped]);

  // Handle focus and blur
  const handleFocusChange = () => {
    if (isAnyFocusedRef.current && isTabActiveRef.current) {
      clearInterval(pausedTimerRef.current);
      pausedTimerRef.current = null;

      if (!elapsedTimerRef.current) {
        elapsedTimerRef.current = setInterval(() => {
          setTimeElapsed((prev) => prev + 1);
        }, 1000);
      }
    } else {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;

      if (!pausedTimerRef.current) {
        pausedTimerRef.current = setInterval(() => {
          setTimePaused((prev) => prev + 1);
        }, 1000);
      }
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
    setTotalWordsTyped(words.length);

    const inputType = e.nativeEvent.inputType;
    if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
      setErrorCount((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    alert("Assignment submitted successfully!");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!assignment) {
    return (
      <div className="assignment-page">
        <h2>Assignment not found.</h2>
      </div>
    );
  }

  if (hasAgreedToEULA === null) {
    return (
      <EndUserLicenseAgreement 
        onAgree={handleEULAAgreement} 
        onDisagree={handleEULADisagreement} 
      />
    );
  }

  return (
    <div className="assignment-page">
      {/* Back Button */}
      <div className="back-button-container">
        <IconButton onClick={handleBack} className="back-button" aria-label="go back">
          <ArrowBackIcon />
        </IconButton>
        <span className="back-button-text">Back</span>
      </div>

      {/* Conditionally Render Video Analytics */}
      {hasAgreedToEULA && (
        <div className="video-analytics-container">
          <VideoAnalytics />
        </div>
      )}

      <h1>{assignment.title}</h1>
      <div className="instruction">
        {assignment.questions.map((q) => q.text).join('\n\n')}
      </div>
      <p className="purpose"><strong>Purpose:</strong> {assignment.purpose}</p>

      {assignment.questions.map((q) => (
        <div key={q.id} className="question-box">
          <h3>{q.text}</h3>
          <textarea
            className="answer-textarea"
            data-optional={q.optional}
            onFocus={() => {
              isAnyFocusedRef.current = true;
              handleFocusChange();
            }}
            onBlur={() => {
              isAnyFocusedRef.current = false;
              handleFocusChange();
            }}
            onChange={handleInputChange}
            placeholder="Start typing your answer here..."
          ></textarea>
        </div>
      ))}

      <div className="aggregated-metrics">
        <h2>Metrics</h2>
        <p>Time Elapsed: {timeElapsed} seconds</p>
        <p>Time Paused: {timePaused} seconds</p>
        <p>Typing Speed: {typingSpeed} WPM</p>
        <p>Total Words Typed: {totalWordsTyped}</p>
        <p>Total Error Corrections: {errorCount}</p>
        <p>Total Tab Switches: {tabSwitchCount}</p>
      </div>

      <button onClick={handleSubmit} className="submit-button">Submit Assignment</button>
      <Chatbot blink={blinkChatbot} isOpen={chatOpen} onToggleOpen={() => setChatOpen((prev) => !prev)} />
    </div>
  );
};

export default AssignmentPage;
