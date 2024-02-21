import {FaGithub, FaJava, FaJsSquare, FaPython, FaReact,} from "react-icons/fa";
import {SiCplusplus, SiCss3, SiHtml5, SiKotlin, SiPostgresql, SiSpring,} from "react-icons/si";

export const pankuriKhare = {
    name: "Pankuri Khare",
    subtitle: "Frontend Lead",
    tagline: "I'm a computer science student at San Francisco State University.",

    social: [{
        name: "pankurik", icon: FaGithub, uri: "https://github.com/pankurik", hover: {
            bg: "gray.900", color: "white",
        },
    },],
    education: [{
        degree: "Bachelor of Science",
        major: "Computer Science",
        major2: "Comparative World Literature",
        school: "San Francisco State University",
        graduation: "Expected Dec 2024",
    },],
    
    projects: [{
        name: "Web Chat Application",
        description: "Developed a user-friendly web chat application enabling instant text messaging across devices. Features include real-time communication, multimedia file sharing, user authentication, group chats and usage of emojis.",
        technologies: ["C++", "HTML", "CSS", "Javascript", "Websocket"],
    }, {
        name: "ZipVizApp",
        links: [{
            name: "Github", uri: "https://github.com/JD499/ZipVizApp",
        }],
        description: "ZipViz is a Java application that visualizes demographic data based on a given ZIP code. The application fetches income distribution data from an API and displays it in various chart formats including bar charts, line charts, pie charts, and Lorenz curves.",
        contribution: "Fetch demographic data based on a given ZIP code, Visualize income distribution data in various chart formats, Export the current chart as an image (.png) or as a CSV file.",
        technologies: ["Java", "JFreeChart", "Swing"],
    }, ],
    skills: [{
        name: "Java", icon: FaJava,
    },  {
            name: "Python", icon: FaPython,
        }, {
            name: "C/C++", icon: SiCplusplus,
        },  {
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