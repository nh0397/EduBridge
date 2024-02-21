import {FaGithub, FaJava, FaJsSquare, FaPython, FaReact,} from "react-icons/fa";
import {SiCplusplus, SiCss3, SiHtml5, SiKotlin, SiPostgresql, SiSpring,} from "react-icons/si";

export const pankuriKhare = {
    name: "Pankuri Khare",
    subtitle: "Frontend Lead",
    tagline: "Hello I am Pankuri Khare, an international student at SF State from India. I am a senior double majoring in Computer Science and Comparative World Literature",

    social: [{
        name: "pankurik", icon: FaGithub, uri: "https://github.com/pankurik", hover: {
            bg: "gray.900", color: "white",
        },
    },],
    education: [{
        degree: "Bachelor of Science",
        major: "Computer Science",
        school: "San Francisco State University",
        graduation: "Expected Dec 2024",
    },],
    
    experience: [],
    
    projects: [{
        name: "Web Chat Application",
        description: "Engineered a dynamic web chat platform facilitating instant text and multimedia exchange across various devices. The application stands out for its real-time communication capabilities, robust user authentication processes, and interactive features like group chats and emojis.",
        contribution: "Spearheaded the integration of advanced functionalities including web scraping with Jsoup for content extraction, streamlined data processing utilizing Java Streams, and complex statistical computations leveraging Apache Commons Math for analytics and insights.",
        technologies: ["C++", "HTML", "CSS", "Javascript", "Websocket"],
    },  ],
    skills: [
        
        {name: "Java", icon: FaJava,}, 
        {name: "C/C++", icon: SiCplusplus,},
        {name: "JavaScript", icon: FaJsSquare,}, 
        {name: "HTML", icon: SiHtml5,}, 
        {name: "CSS", icon: SiCss3,},
        {name: "React", icon: FaReact,},
    
    ],
};