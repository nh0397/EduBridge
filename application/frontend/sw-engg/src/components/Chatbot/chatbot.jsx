import React from "react";
import "./chatbot.css";
import chatbotLogo from "../../images/ChatBotLogo.png";

const Chatbot = ({ triggerBlink }) => {
  console.log("Chatbot component render. Blink:", triggerBlink); // Debugging: log the blink prop

  return (
    <div className='${triggerBlink} ? "blink" : ""}'>  
      <div className="chatbot-button">
        <img src={chatbotLogo} alt="Chatbot" className="chatbot-logo" />
      </div>
    </div>
  );
};

export default Chatbot;
