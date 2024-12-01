import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AssignmentPage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import io from "socket.io-client";
import assignmentQuestions from './assignmentQuestions';

const assignmentsData = assignmentQuestions;

// Create the WebSocket instance outside the component to prevent recreation
const socket = io("http://localhost:3001");

const AssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignment = assignmentsData[id];

  // Metrics
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [timePaused, setTimePaused] = useState(0); // in seconds
  const [typingSpeed, setTypingSpeed] = useState(0); // WPM
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);

  const isAnyFocusedRef = useRef(false);
  const isTabActiveRef = useRef(true);
  const elapsedTimerRef = useRef(null);
  const pausedTimerRef = useRef(null);

  // Ref to store the latest state
  const stateRef = useRef({
    timeElapsed,
    timePaused,
    typingSpeed,
    tabSwitchCount,
    errorCount,
    totalWordsTyped,
  });

  // Keep the ref in sync with the state
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

  // Emit current state values to the backend every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const message = stateRef.current; // Use the latest state from the ref
      console.log("Sending to backend:", message);
      socket.emit("time-message", message); // Send message to backend
    }, 3000);

    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Recalculate typing speed whenever timeElapsed or totalWordsTyped changes
  useEffect(() => {
    if (timeElapsed > 0) {
      const wpm = Math.floor((totalWordsTyped / timeElapsed) * 60);
      setTypingSpeed(wpm);
    }
  }, [timeElapsed, totalWordsTyped]); // Depend on timeElapsed and totalWordsTyped

  // Handle WebSocket connection and acknowledgment
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server!");
    });

    // Listen for acknowledgment from the backend
    socket.on("acknowledgment", (data) => {
      console.log("Acknowledgment from backend:", data);
    });

  }, []);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabActiveRef.current = false;
        setTabSwitchCount((prev) => prev + 1);
        handleFocusChange();
      } else {
        isTabActiveRef.current = true;
        handleFocusChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(elapsedTimerRef.current);
      clearInterval(pausedTimerRef.current);
    };
  }, []);

  // Handle focus and blur events
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

  const handleFocus = () => {
    isAnyFocusedRef.current = true;
    handleFocusChange();
  };

  const handleBlur = () => {
    isAnyFocusedRef.current = false;
    handleFocusChange();
  };

  const handleInputChange = (e) => {
    const text = e.target.value;

    // Word counting based on spaces
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
    setTotalWordsTyped(words.length);

    const inputType = e.nativeEvent.inputType;
    if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
      setErrorCount((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    alert('Assignment submitted successfully!');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!assignment) {
    return <div className="assignment-page"><h2>Assignment not found.</h2></div>;
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
            onFocus={handleFocus}
            onBlur={handleBlur}
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
    </div>
  );
};

export default AssignmentPage;
