import {Box} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import {useParams} from "react-router-dom";
import {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import { SiCplusplus, SiCss3, SiHtml5, SiKotlin, SiPostgresql, SiSpring } from "react-icons/si";





const IndividualPage = (props) => {
    const location = useLocation()
    const { profile } = location.state
    console.log("props", profile.profiles)
    const [me, setMe] = useState(null);

    useEffect(() => {
        setMe(profile.profiles);
    });


    if (!me) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <Navbar me={me}/>
            <Hero me={me}/>
            <Education me={me}/>
            <Experience me={me}/>
            <Projects me={me}/>
            <Skills me={me}/>
        </Box>
    );
};

export default IndividualPage;