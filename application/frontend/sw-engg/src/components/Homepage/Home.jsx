import React, { useState,useEffect } from 'react';
import ParticlesBg from 'particles-bg';
import './Home.scss';
import SyntaxSquadLogo from '../../images/Syntax-Squad.jpg'; // Ensure the correct path
import AboutCards from '../AboutCards/aboutCards';

const Home = () => {
  // Function to scroll to the next section
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior:'smooth'});
    }
  };

  // Effect to scroll to the top of the page on component mount
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  return (
    <>
      <div className="home">
        <ParticlesBg color="#aa0000" num={225} type="fountain" bg={true} />
        <div className="centered-text">Meet the Team</div>
        <img src={SyntaxSquadLogo} alt="Syntax Squad Logo" className="logo-animation"/>
        {/* Caret icon to scroll */}
        <div className="scroll-caret" onClick={scrollToNextSection}>
          &#8964; {/* This is the Unicode character for a downward pointing caret. */}
        </div>
      </div>
      {/* Next section */}
      <div id="next-section" className="next-section-content"> 
      <div className="about-text centered-text">About Us</div>
      <div className='card-section'>
       <AboutCards
       className="about-card"
        details={{
          name:"Dylan Nguyen",
          role:"Scrum Master I",
          instagram_id:"",
          mail_id:""
        }}
       />
       <AboutCards
       className="about-card"
       details={{
        name:"James Dixon",
        role:"Scrum Master II",
        instagram_id:"",
        mail_id:""
      }}
       />
       <AboutCards
       className="about-card"
       details={{
        name:"Pankuri Khare",
        role:"Frontend Lead",
        instagram_id:"https://www.instagram.com/pankuri.17",
        mail_id:"pkhare@mail.sfsu.edu"
      }}
       />
       <AboutCards
       className="about-card"
       details={{
        name:"Riken Kapadia",
        role:"GitHub Master",
        instagram_id:"",
        mail_id:""
      }}
       />
       <AboutCards
       className="about-card"
       details={{
        name:"Shail Patel",
        role:"Backend Lead",
        instagram_id:"",
        mail_id:""
      }}
       />
       <AboutCards
       className="about-card"
       details={{
        name:"Naisarg Halvadiya",
        role:"Team Leader",
        instagram_id:"",
        mail_id:""
      }}
       />
      </div>
      </div>
    </>
  );
};

export default Home;
