// src/components/AssignmentPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AssignmentPage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

const assignmentsData = {
  1: {
    title: 'Simple Writing Prompt',
    questions: [
      {
        id: 'q1',
        text: 'Q1: Describe your favorite holiday or vacation experience. Where did you go? What did you do? Why was it memorable?',
        optional: false,
      },
      {
        id: 'q2',
        text: 'Q2 (optional for variety): If you could have any superpower, what would it be and why?',
        optional: true,
      },
    ],
    purpose: 'Simple and engaging topic that requires minimal cognitive effort but ensures enough typing to capture metrics like typing speed and pauses.',
  },
  2: {
    title: 'Reasoning and Reflection',
    questions: [
      {
        id: 'q1',
        text: 'Q1: Imagine you’re a city planner. What would you change in your city to make it more sustainable and environmentally friendly? Why?',
        optional: false,
      },
      {
        id: 'q2',
        text: 'Q2 (optional for variety): Reflect on a time when you faced a difficult decision. What was the decision, and how did you resolve it?',
        optional: true,
      },
    ],
    purpose: 'Prompts require light reasoning and reflection, which could lead to pauses, error corrections, or deviations for students who find these topics more challenging to articulate.',
  },
  3: {
    title: 'Technical Writing and Problem Solving',
    questions: [
      {
        id: 'q1',
        text: 'Q1: Explain the difference between a stack and a queue, including real-world examples of where each is used.',
        optional: false,
      },
      {
        id: 'q2',
        text: 'Q2 (optional for variety): Describe the steps of a sorting algorithm you know (e.g., Bubble Sort, Merge Sort) in detail and explain why sorting is important in computer science.',
        optional: true,
      },
    ],
    purpose: 'These questions involve both technical knowledge and the ability to articulate concepts clearly, which could trigger behaviors like pauses, tab switches (to look up information), or increased error rates.',
  },
};

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

  // Refs
  const isAnyFocusedRef = useRef(false);
  const isTabActiveRef = useRef(true);
  const elapsedTimerRef = useRef(null);
  const pausedTimerRef = useRef(null);

  useEffect(() => {
    if (!assignment) return;

    // Event listener for tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive
        isTabActiveRef.current = false;
        setTabSwitchCount((prev) => prev + 1);
        handleFocusChange();
      } else {
        // Tab is active
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
  }, [assignment]);

  const handleFocusChange = () => {
    if (isAnyFocusedRef.current && isTabActiveRef.current) {
      // User is active
      clearInterval(pausedTimerRef.current);
      pausedTimerRef.current = null;
      if (!elapsedTimerRef.current) {
        elapsedTimerRef.current = setInterval(() => {
          setTimeElapsed((prev) => prev + 1);
        }, 1000);
      }
    } else {
      // User is inactive
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

    // Error Corrections
    const inputType = e.nativeEvent.inputType;
    if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
      setErrorCount((prev) => prev + 1);
    }

    // Update typing speed
    if (timeElapsed > 0) {
      const wpm = Math.floor((words.length / timeElapsed) * 60);
      setTypingSpeed(wpm);
    }
  };

  const handleSubmit = () => {
    // Check if all required answers meet the word count
    const allTextareas = document.querySelectorAll('.answer-textarea');
    let allValid = true;

    allTextareas.forEach((textarea) => {
      const isOptional = textarea.getAttribute('data-optional') === 'true';
      const wordCount = textarea.value.trim().split(/\s+/).filter((word) => word.length > 0).length;

      if (!isOptional && wordCount < 150) {
        allValid = false;
        alert(`Please write at least 150 words for all required questions.`);
      }
    });

    if (!allValid) return;

    // Stop timers
    clearInterval(elapsedTimerRef.current);
    clearInterval(pausedTimerRef.current);

    // Final typing speed update
    if (timeElapsed > 0) {
      const wpm = Math.floor((totalWordsTyped / timeElapsed) * 60);
      setTypingSpeed(wpm);
    }

    // Submission logic
    alert('Assignment submitted successfully!');
    console.log('Metrics:', {
      timeElapsed,
      timePaused,
      typingSpeed,
      tabSwitchCount,
      errorCount,
      totalWordsTyped,
    });
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
      <p className="purpose">
        <strong>Purpose:</strong> {assignment.purpose}
      </p>

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

      <button onClick={handleSubmit} className="submit-button">
        Submit Assignment
      </button>
    </div>
  );
};

export default AssignmentPage;
