import {FaGithub, FaJava, FaJsSquare, FaPython, FaReact,} from "react-icons/fa";
import {SiCplusplus, SiCss3, SiHtml5, SiKotlin, SiPostgresql, SiSpring,} from "react-icons/si";

export const naisargHalvadiya = {
    name: "Naisarg Halvadiya",
    subtitle: "Scrum Master II",
    tagline: "I'm a computer science student at San Francisco State University.",

    social: [{
        name: "Github", icon: FaGithub, uri: "https://github.com/JD499", hover: {
            bg: "gray.900", color: "white",
        },
    },],
    education: [{
        degree: "Bachelor of Science",
        major: "Computer Science",
        school: "San Francisco State University",
        graduation: "Expected Dec 2024",
    }, {
        degree: "Associate’s of Arts", major: "Liberal Arts", school: "Bakersfield College", graduation: "May 2022",
    },],
    experience: [{
        company: "Kern Community College District",
        location: "Bakersfield, CA",
        position: "Computer Science Tutor",
        duration: "Aug 2020 - Dec 2021",
        bullets: ["Tutored students in computer science principles, algorithms, data structures, and programming languages such as Java, C++, and Python.", "Developed and implemented lesson plans and curriculum for individual tutoring sessions.", "Assisted students in understanding and completing homework assignments and projects.", "Provided one-on-one support and guidance for students struggling with course material.", "Evaluated student progress and provided feedback to students and instructors.", "Collaborated with instructors and department staff to improve course content and delivery.",],
    },],
    projects: [{
        name: "ValorantProSettingsScraper",
        links: [{
            name: "Github", uri: "https://github.com/JD499/valorantProSettingsScraper",
        }],
        description: "Valorant Pro Settings Scraper is a Java-based application designed to scrape professional Valorant players' settings from prosettings.net. It processes the data to calculate and display various statistics, including the minimum and maximum eDPI values per team, mean and median eDPI values, and the overall highest and lowest eDPI players among professional Valorant players.",
        contribution: "Web scraping using Jsoup, Data processing with Java Streams, Statistical calculations using Apache Commons Math.",
        technologies: ["Java", "Jsoup", "Java Streams", "Apache Commons Math"],
    }, {
        name: "ZipVizApp",
        links: [{
            name: "Github", uri: "https://github.com/JD499/ZipVizApp",
        }],
        description: "ZipViz is a Java application that visualizes demographic data based on a given ZIP code. The application fetches income distribution data from an API and displays it in various chart formats including bar charts, line charts, pie charts, and Lorenz curves.",
        contribution: "Fetch demographic data based on a given ZIP code, Visualize income distribution data in various chart formats, Export the current chart as an image (.png) or as a CSV file.",
        technologies: ["Java", "JFreeChart", "Swing"],
    }, {
        name: "FM Squad Builder",
        links: [{
            name: "Github", uri: "https://github.com/JD499/fm-squad-builder",
        }],
        description: "Developed a tool tailored for the game ”Football Manager 2023” to assist managers in squad selection.",
        contribution: "Implemented a parser to directly convert exported HTML player data from the game into structured Java objects. Designed a user-friendly interface using JavaFX to populate the application with detailed player information. Integrated a tactic selection feature, allowing users to choose specific game tactics and input the exported HTML. Engineered an algorithm to calculate and recommend the best players for selected positions and roles based on the tactic, optimizing squad performance.",
        technologies: ["Java", "JavaFX"],
    }, {
        name: "Fund Breakdown",
        links: [{
            name: "Github", uri: "https://github.com/JD499/fund-breakdown",
        }],
        description: "Developed a web application to analyze and display the holdings of financial portfolios.",
        contribution: "Utilized Flask for the backend to handle data processing and API requests. Implemented concurrent data fetching and processing using Python’s ThreadPoolExecutor. Designed the frontend using React and TypeScript, offering routes to different views like Portfolio and Holdings. Integrated user input to fetch data about specific financial symbols and display their breakdown.",
        technologies: ["Python", "Flask", "React", "TypeScript"],
    }, {
        name: "JTrivia",
        links: [{
            name: "Github", uri: "https://github.com/JD499/jtrivia",
        }],
        description: "Developed a comprehensive trivia REST API using Kotlin, Spring Boot, and PostgreSQL.",
        contribution: "Contains over 28,923 trivia questions across 5,035 categories. Offers multiple endpoints, supporting queries by value, category, air date, and more, with built-in pagination. Designed for integration into Jeopardy-style web games and other trivia applications.",
        technologies: ["Kotlin", "Spring Boot", "PostgreSQL"],
    }, {
        name: "JepJS",
        description: "Developed a Jeopardy-style quiz game using JavaScript, Node.js, Express, and Socket.io.",
        contribution: "Implemented real-time multiplayer functionality using websockets (Socket.io). Built user interface using React, allowing for dynamic updates and a responsive design. Utilized Express to handle server-side routing and API calls.",
        technologies: ["JavaScript", "Node.js", "Express", "Socket.io", "React"],
    },],
    skills: [{
        name: "Java", icon: FaJava,
    }, {
        name: "Spring", icon: SiSpring,
    }, {
        name: "Kotlin", icon: SiKotlin,
    },

        {
            name: "Python", icon: FaPython,
        }, {
            name: "C/C++", icon: SiCplusplus,
        },

        {
            name: "SQL (Postgres)", icon: SiPostgresql,
        }, {
            name: "JavaScript", icon: FaJsSquare,
        }, {
            name: "HTML", icon: SiHtml5,
        }, {
            name: "CSS", icon: SiCss3,
        },

        {
            name: "React", icon: FaReact,
        },],
};