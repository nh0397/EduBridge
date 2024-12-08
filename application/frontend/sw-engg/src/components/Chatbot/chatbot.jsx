import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';
import chatbotLogo from '../../images/ChatBotLogo.png';

const Chatbot = React.memo(({ blink, isOpen, onToggleOpen, showIntroMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Show introductory message when the chatbot is opened for the first time
  useEffect(() => {
    if (isOpen && showIntroMessage) {
      setMessages([{ role: 'assistant', text: 'Hey, what can I do for you?' }]);
    }
  }, [isOpen, showIntroMessage]);

  const handleSendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Add the user's message immediately
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');

    try {
      // Simulate a backend response
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      setMessages((prev) => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, something went wrong.' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Hide the icon entirely when the chatbot panel is open
  if (isOpen) {
    return (
      <div className={`chatbot-container open`}>
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <img src={chatbotLogo} alt="chatbot" className="chatbot-header-logo-img" />
            <h2>Chatbot</h2>
            <button className="close-btn" onClick={onToggleOpen}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className={`chatbot-icon ${blink ? 'blink' : ''}`} onClick={onToggleOpen}>
        <img src={chatbotLogo} alt="Chatbot" className="chatbot-logo" />
      </div>
    </div>
  );
});

export default Chatbot;
