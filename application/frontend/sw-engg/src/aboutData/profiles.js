
const profiles = [
  {
    name: "Naisarg Halvadiya",
    subtitle: "Team Leader",
    tagline: "As a Data Scientist with Full-Stack Development skills, I excel in fusing data analytics with web development to innovate and solve complex problems. My expertise lies in deriving actionable insights from data using advanced analytics and visualization, coupled with designing dynamic, user-oriented web applications. Proficient in diverse programming languages and frameworks, I seamlessly integrate data insights into web solutions, enhancing decision-making and user experience.",
    social: [
      {
        name: "Github",
        icon: "FaGithub",
        uri: "https://github.com/nh0397",
        hover: { bg: "gray.900", color: "white" }
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology",
        major: "Computer Science",
        school: "Nirma University, India",
        graduation: "May 2019"
      },
      {
        degree: "Master of Science",
        major: "Data Science and AI",
        school: "San Francisco State University",
        graduation: "May 2025"
      }
    ],
    experience: [
      {
        company: "Mu Sigma Business Solutions Pvt. Ltd.",
        location: "Bangalore, India",
        position: "Full Stack Developer",
        duration: "Oct 2020 - Dec 2021",
        bullets: [
          "Developed and implemented a state-of-the-art Content Management System (CMS) utilizing React.js, Node.js, and integrated Alfresco, PostgreSQL, MySQL, and Redis for efficient data management. Resulted in an impressive 10% increase in client satisfaction and revenue growth among 10+ Fortune 500 companies.",
          "Revamped and expanded a Real-Time Data Streaming application for CPG Product Launch Simulation. Leveraged React.js, Kafka, PostgreSQL, and Node.js to achieve an exceptional 50% reduction in simulation time, resulting in faster decision-making processes for clients.",
          "Coordinated the creation of a robust work tracking and evaluation application using Angular (TypeScript), Node.js (REST APIs), PostgreSQL, and GitLab. This system catered to over 100 users for seamless half-yearly performance assessments while streamlining operations by eliminating manual work processes. Successfully reduced assessment time by an impressive 50%, improving overall efficiency within the organization..",
        ]
      },
      {
        company: "Mu Sigma Business Solutions Pvt. Ltd.",
        location: "Bangalore, India",
        position: "Data Scientist",
        duration: "Oct 2019 - Sep 2020",
        bullets: [
          "Developed and executed a COVID behavior simulation tool utilizing a basic epidemiological model, collaborating with 10+ cross-functional teams. The tool analyzed the impact of the pandemic on operations, resulting in a 10% time savings for the organization. Employed Python Dash and Plotly for data visualization to enhance user experience..",
          "Successfully implemented a Database Management System (DBMS) to centralize data from over 25 business teams. This streamlined data management processes and positively impacted customer retention rates by 10%. Developed custom dashboards using the Python Dash Framework for real-time performance monitoring, enabling quick identification of areas for improvement.",
          "Created an advanced data analytics algorithm that leveraged machine learning techniques to forecast consumer behavior patterns. This algorithm accurately predicted customer preferences with an average accuracy rate of 95%, leading to improved marketing strategies and a 15% increase in sales revenue."
        ]
      }
    ],
    projects: [
      {
        name: "FlareGraph Data Visualization",
        links: [{ name: "Github", uri: "https://github.com/nh0397/Data-Viz-SFFD" }],
        description: "Uncovered critical insights into public safety strategies over the years by creating interactive Python visualizations with Plotly and Dash that revealed key patterns from San Francisco Fire Department data.",
        technologies: ["Python", "Dash", "JavaScript", "HTML", "CSS"]
      },
      {
        name: "Knowledge Sharing Platform",
        description: "Designed and developed a web platform using PHP and MongoDB, enabling seamless content contribution by students and faculty. Implemented Python algorithms for efficient keyword extraction and text matching to enhance document search.",
        technologies: ["Python", "PHP", "MongoDB","JavaScript", "HTML", "CSS"]
      },
      // More projects...
    ],
    skills: [
      { name: "JavaScript", icon: "FaJava" },
      { name: "Python", icon: "SiSpring" },
      { name: "R", icon: "SiKotlin" },
      { name: "MySQL", icon: "FaPython" },
      { name: "PostgreSQL", icon: "SiCplusplus" },
      { name: "Microsoft SQL Server", icon: "SiPostgresql" },
      { name: "Redis", icon: "FaJsSquare" },
      { name: "MongoDB", icon: "SiHtml5" },
      { name: "Docker", icon: "SiCss3" },
      { name: "Kubernetes", icon: "FaReact" },
      { name: "Tableau", icon: "FaReact" },
      { name: "GitHub", icon: "FaReact" },
      { name: "GitLab", icon: "FaReact" }
    ]
  },
  {
    name: "James Dixon",
    subtitle: "Team Leader",
    tagline: "A graduate student majoring in Data Science and AI at San Francisco State University.",
    social: [
      {
        name: "Github",
        icon: "FaGithub",
        uri: "https://github.com/n0397",
        hover: { bg: "gray.900", color: "white" }
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology",
        major: "Computer Science",
        school: "Nirma University, India",
        graduation: "May 2019"
      },
      {
        degree: "Master of Science",
        major: "Data Science and AI",
        school: "San Francisco State University",
        graduation: "May 2025"
      }
    ],
    experience: [
      {
        company: "Mu Sigma Business Solutions Pvt. Ltd.",
        location: "Bangalore, India",
        position: "Full Stack Developer",
        duration: "Aug 2020 - Dec 2021",
        bullets: [
          "Tutored students in computer science principles, algorithms, data structures, and programming languages such as Java, C++, and Python.",
          "Developed and implemented lesson plans and curriculum for individual tutoring sessions.",
          "Assisted students in understanding and completing homework assignments and projects.",
          "Provided one-on-one support and guidance for students struggling with course material.",
          "Evaluated student progress and provided feedback to students and instructors.",
          "Collaborated with instructors and department staff to improve course content and delivery."
        ]
      }
    ],
    projects: [
      {
        name: "ValorantProSettingsScraper",
        links: [{ name: "Github", uri: "https://github.com/JD499/valorantProSettingsScraper" }],
        description: "Valorant Pro Settings Scraper is a Java-based application designed to scrape professional Valorant players' settings from prosettings.net. It processes the data to calculate and display various statistics, including the minimum and maximum eDPI values per team, mean and median eDPI values, and the overall highest and lowest eDPI players among professional Valorant players.",
        contribution: "Web scraping using Jsoup, Data processing with Java Streams, Statistical calculations using Apache Commons Math.",
        technologies: ["Java", "Jsoup", "Java Streams", "Apache Commons Math"]
      },
      {
        name: "ZipVizApp",
        links: [{ name: "Github", uri: "https://github.com/JD499/ZipVizApp" }],
        description: "ZipViz is a Java application that visualizes demographic data based on a given ZIP code. The application fetches income distribution data from an API and displays it in various chart formats including bar charts, line charts, pie charts, and Lorenz curves.",
        contribution: "Fetch demographic data based on a given ZIP code, Visualize income distribution data in various chart formats, Export the current chart as an image (.png) or as a CSV file.",
        technologies: ["Java", "JFreeChart", "Swing"]
      },
      // More projects...
    ],
    skills: [
      { name: "Java", icon: "FaJava" },
      { name: "Spring", icon: "SiSpring" },
      { name: "Kotlin", icon: "SiKotlin" },
      { name: "Python", icon: "FaPython" },
      { name: "C/C++", icon: "SiCplusplus" },
      { name: "SQL (Postgres)", icon: "SiPostgresql" },
      { name: "JavaScript", icon: "FaJsSquare" },
      { name: "HTML", icon: "SiHtml5" },
      { name: "CSS", icon: "SiCss3" },
      { name: "React", icon: "FaReact" }
    ]
  },
  {
    name: "Dylan Nguyen",
    subtitle: "Scrum master",
    tagline: "A senior majoring in Computer Science at San Francisco State University.",
    social: [
      {
        name: "Github",
        icon: "FaGithub",
        uri: "https://github.com/TheDylz",
        hover: { bg: "gray.900", color: "white" }
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology",
        major: "Computer Science",
        school: "San Francisco State University",
        graduation: "December 2024"
      },
    ],
    experience: [
    ],
    projects: [
      {
        name: "Snake Game",
        description: "Snake tile game where player controls snake to eat apples for points. If snake hits a random generated bomb on board, game over",
        contribution: "Used Java and Swing to make game functions and visuals.",
        technologies: ["Java"]
      },
      // More projects...
    ],
    skills: [
      { name: "Java", icon: "FaJava" },
      { name: "C/C++", icon: "SiCplusplus" },
      { name: "JavaScript", icon: "FaJsSquare" },
      { name: "HTML", icon: "SiHtml5" },
      { name: "CSS", icon: "SiCss3" },
      { name: "React", icon: "FaReact" }
    ]
  },
  {
    name: "Riken Kapadia",
    subtitle: "GitHub Master",
    tagline: "Hello I am Riken Kapadia and I am international undergrade student majoring in Computer Science at San Francisco state University.",
    social: [
      {
        name: "RikenKapadia",
        icon: "FaGithub",
        uri: "https://github.com/RikenKapadia",
        hover: { bg: "gray.900", color: "white" }
      }
    ],
    education: [
      {
        degree: "Diploma",
        major: "Information and Technology",
        school: "Deakin College, Australia",
        graduation: "July 2021"
      },
      {
        degree: "Bachelor of Science",
        major: "Computer Science",
        school: "San Francisco State University",
        graduation: "December 2024"
      }
    ],
    experience: [
    ],
    projects: [
      {
        name: "Tank Game",
        description: "This is a multiplayer game where the player can play with a CPU and with another player as well. The game contains different kinds of functionality like having a verity of attack options and healing options after being attacked by an opposite player.",
        contribution: "enhanced user experience and engagement by designing and implementing a HCI level UI/UX design for simple implementation",
        technologies: ["Java", "HTML", "CSS", "JavaScript"]
      },
      {
        name: "Chatbot",
        description: "The institution has implemented a chatbot to assist students with resources and university support.",
        contribution: "It was just a Java in app design for data strcuture understanding.",
        technologies: ["Java"]
      },
      // More projects...
    ],
    skills: [
      { name: "Java", icon: "FaJava" },
      { name: "Python", icon: "FaPython" },
      { name: "C/C++", icon: "SiCplusplus" },
      { name: "SQL (Postgres)", icon: "SiPostgresql" },
      { name: "JavaScript", icon: "FaJsSquare" },
      { name: "HTML", icon: "SiHtml5" },
      { name: "CSS", icon: "SiCss3" },
      { name: "React", icon: "FaReact" }
    ]
  },
  {
    name: "Pankuri Khare",
    subtitle: "Frontend Lead",
    tagline: "Hello I am Pankuri Khare, an international student at SF State from India. I am a senior double majoring in Computer Science and Comparative World Literature",
    social: [
      {
        name: "Github",
        icon: "FaGithub",
        uri: "https://github.com/pankurik",
        hover: { bg: "gray.900", color: "white" }
      }
    ],
    education: [
      {
        degree: "Bachleors of Science",
        major: "Computer Science & Comparative World Literature",
        school: "San Francisco State University",
        graduation: "December 2024"
      }
    ],
    experience: [
    ],
    projects: [
      {
        name: "Web Chat Application",
        description: "Engineered a dynamic web chat platform facilitating instant text and multimedia exchange across various devices. The application stands out for its real-time communication capabilities, robust user authentication processes, and interactive features like group chats and emojis.",
        contribution: "Spearheaded the integration of advanced functionalities including web scraping with Jsoup for content extraction, streamlined data processing utilizing Java Streams, and complex statistical computations leveraging Apache Commons Math for analytics and insights.",
        technologies: ["C++", "HTML", "CSS", "Javascript", "Websocket"],
      },
    ],
    skills: [
      { name: "Java", icon: "FaJava" },
      { name: "Python", icon: "FaPython" },
      { name: "C/C++", icon: "SiCplusplus" },
      { name: "JavaScript", icon: "FaJsSquare" },
      { name: "HTML", icon: "SiHtml5" },
      { name: "CSS", icon: "SiCss3" },
      { name: "React", icon: "FaReact" }
    ]
  },
  {
    name: "Shail Patel",
    subtitle: "Backend Leader",
    tagline: "A graduate student majoring in Computer Science at San Francisco State University.",
    social: [
      {
        name: "Github",
        icon: "FaGithub",
        uri: "https://github.com/shailtp",
        hover: { bg: "gray.900", color: "white" }
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology",
        major: "Computer Science",
        school: "Vellore institute of technology, India",
        graduation: "May 2023"
      },
      {
        degree: "Master of Science",
        major: "Computer Science",
        school: "San Francisco State University",
        graduation: "May 2025"
      }
    ],
    experience: [
      {
        company: "Flowjet Valves Pvt. Ltd.",
        location: "Ahmedabad, India",
        position: "Software Engineer",
        duration: "Jan 2022 - Dec 2022",
        bullets: [
          "Worked as a Software Development co-op intern in the Information Technology department of this valve manufacturing industry.",
          "Utilizing machine learning algorithms, a 30-day demand forecast for a product was generated. This forecast, which achieved approximately 70% accuracy on real-time seller data, can assist in choosing a location that can fulfill the order",
          "Also worked on the backend development and database management of the company E-commerce portal using Django and MongoDB."
        ]
      }
    ],
    projects: [
      {
        name: "Runout",
        links: [{ name: "Github", uri: "https://github.com/shailtp/ExpenseTracker" }],
        description: "Led the development of an innovative action maze chase Human-Computer Interaction (HCI) application using Python and Pygame. This project featured the implementation of an AI-based opponent that dynamically follows the player, using the A* algorithm to determine the optimal path based on the player's movements",
        contribution: "Designed and implemented a user-friendly GUI to enhance user engagement and experience.",
        technologies: ["Python, PyGame, A* algo"]
      },
      {
        name: "Nina, a personal expense tracker",
        links: [{ name: "Github", uri: "https://github.com/shailtp/ExpenseTracker" }],
        description: "Developed and maintained a comprehensive expense tracking application for iOS. Managed all aspects of the app's development in XCode, ensuring a robust and user-friendly experience.",
        contribution: "Implemented features for real-time expense recording, categorization, and data visualization. Conducted extensive unit and UI testing to guarantee app reliability and usability.",
        technologies: ["SwiftUI, Coredata, Json Parsing"]
      },
      // More projects...
    ],
    skills: [
      { name: "Java", icon: "FaJava" },
      { name: "Spring", icon: "SiSpring" },
      { name: "Kotlin", icon: "SiKotlin" },
      { name: "Python", icon: "FaPython" },
      { name: "C/C++", icon: "SiCplusplus" },
      { name: "SQL (Postgres)", icon: "SiPostgresql" },
      { name: "JavaScript", icon: "FaJsSquare" },
      { name: "HTML", icon: "SiHtml5" },
      { name: "CSS", icon: "SiCss3" },
      { name: "React", icon: "FaReact" }
    ]
  },
  
 
];

export default profiles;
