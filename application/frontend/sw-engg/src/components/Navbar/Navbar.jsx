



import React from 'react';
import './Navbar.css'; // Importing the CSS for styling

const Navbar = ({ userName }) => {
  return (
    <body class="navbar">
        <header>
          <h1>EduBridge</h1>
          {/* <img class="logoedubridge" src="" alt="edubridge" /> */}
          <input type="search" placeholder="Search"></input>
          <nav>
            <ul class="nav__links">
              <li><a href="#">About</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </nav>
          <a class="logout" href="#"><button>Logout</button></a>
        </header>
      </body>
  );
};

export default Navbar;