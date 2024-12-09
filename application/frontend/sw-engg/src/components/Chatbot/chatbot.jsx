import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';
import chatbotLogo from '../../images/ChatBotLogo.png';

const Chatbot = React.memo(({ blink, isOpen, onToggleOpen }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [introMessageShown, setIntroMessageShown] = useState(false); // Track if intro message has been shown

  // Scroll to the bottom of the messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Show introductory message when the chatbot is opened for the first time
  useEffect(() => {
    if (isOpen && !introMessageShown) {
      const introMessage = blink
        ? 'Looks like you need help with something, tell me more about it.'
        : 'Hey, what can I do for you?';

      // Add the intro message only if there are no existing messages
      if (messages.length === 0) {
        setMessages([{ role: 'assistant', text: introMessage }]);
      }

      setIntroMessageShown(true); // Mark the intro message as shown
    }
  }, [isOpen, blink, introMessageShown, messages]);

  const handleSendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Add the user's message immediately
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');

    try {
      // Simulate a backend response
      const response = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
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

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Chatbot Icon */}
      {!isOpen && (
        <div className={`chatbot-icon ${blink ? 'blink' : ''}`} onClick={onToggleOpen}>
          <img src={chatbotLogo} alt="Chatbot" className="chatbot-logo" />
        </div>
      )}

      {/* Chatbot Panel */}
      {isOpen && (
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
      )}
    </div>
  );
});

export default Chatbot;
