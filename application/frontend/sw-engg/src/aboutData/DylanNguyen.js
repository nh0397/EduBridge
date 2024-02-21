import {FaGithub, FaJava, FaJsSquare, FaPython, FaReact,} from "react-icons/fa";
import {SiCplusplus, SiCss3, SiHtml5, SiKotlin, SiPostgresql, SiSpring,} from "react-icons/si";

export const dylanNguyen = {
    name: "Dylan Nguyen",
    subtitle: "Scrum Master I",
    tagline: "I'm a computer science student at San Francisco State University.",

    social: [{
        name: "Github", icon: FaGithub, uri: "https://github.com/TheDylz", hover: {
            bg: "gray.900", color: "white",
        },
    },],
    education: [{
        degree: "Bachelor of Science",
        major: "Computer Science",
        school: "San Francisco State University",
        graduation: "Expected Dec 2024",
    }, 
    ],
    experience: [],
    projects: [
],

    skills: [
        
        {name: "Java", icon: FaJava,}, 
        {name: "C/C++", icon: SiCplusplus,},
        {name: "JavaScript", icon: FaJsSquare,}, 
        {name: "HTML", icon: SiHtml5,}, 
        {name: "CSS", icon: SiCss3,},
        {name: "React", icon: FaReact,},
    
    ],
};