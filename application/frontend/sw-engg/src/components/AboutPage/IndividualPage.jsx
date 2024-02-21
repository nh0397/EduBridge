import {Box} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import {useParams} from "react-router-dom";
import {useEffect, useState} from 'react';
import {jamesDixon} from '../../aboutData/JamesDixon.js';
import {dylanNguyen} from '../../aboutData/DylanNguyen.js';
import {pankuriKhare} from "../../aboutData/PankuriKhare";
import {rikenKapadia} from "../../aboutData/RikenKapadia";
import {shailPatel} from "../../aboutData/ShailPatel";
import {naisargHalvadiya} from "../../aboutData/NaisargHalvadiya";

const dataMap = {
    'James-Dixon': jamesDixon,
    'Dylan-Nguyen': dylanNguyen,
    'Pankuri-Khare': pankuriKhare,
    'Riken-Kapadia': rikenKapadia,
    'Shail-Patel': shailPatel,
    'Naisarg-Halvadiya': naisargHalvadiya,
};

const IndividualPage = () => {
    const {name} = useParams();
    const [me, setMe] = useState(null);

    useEffect(() => {
        setMe(dataMap[name]);
    }, [name]);


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