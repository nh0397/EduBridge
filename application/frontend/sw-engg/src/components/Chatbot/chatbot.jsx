import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';
import chatbotLogo from '../../images/ChatBotLogo.png';

const Chatbot = React.memo(({ blink, isOpen, onToggleOpen }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [hasOpened, setHasOpened] = useState(false); // Track if we've shown the intro message already

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // If chatbot just opened and we haven't shown an intro message yet, show it
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      const introMessage = blink 
        ? "Do you need help?" 
        : "Hey, what can I do for you?";
      setMessages([{ role: 'assistant', text: introMessage }]);
    }
  }, [isOpen, hasOpened, blink]);

  const handleSendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Show user's message immediately
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');

    try {
      // Call backend API for a response
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();

      // Update messages with assistant's reply
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

  // Stop blinking once opened by not applying blink class if isOpen is true
  const iconClass = `chatbot-icon ${blink && !isOpen ? 'blink' : ''}`;

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className={iconClass} onClick={onToggleOpen}>
        <img src={chatbotLogo} alt="Chatbot" className="chatbot-logo" />
      </div>
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="header-left">
              <img src={chatbotLogo} alt="chatbot" className="chatbot-header-logo-img" />
              <h2>Chatbot</h2>
            </div>
            <button className="close-btn" onClick={onToggleOpen}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
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
