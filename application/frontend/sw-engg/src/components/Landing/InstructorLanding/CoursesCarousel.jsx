import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiService from '../../../services/apiService';

// Define custom arrows for the carousel
const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", left: 25, zIndex: 1 }}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faChevronLeft} />
        </div>
    );
};

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", right: 25, zIndex: 1 }}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faChevronRight} />
        </div>
    );
};

const CoursesCarousel = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const fetchedCourses = await apiService.fetchCourses();
                if (fetchedCourses) {
                    setCourses(fetchedCourses);
                } else {
                    console.log("No courses fetched, check API and response structure");
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Adjust the number of slides to show
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 5000,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <div className="courses-carousel-container">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Popular Courses</h2>
            <Slider {...settings}>
                {courses.map((course, index) => (
                    <div key={index} className="course-slide" style={{ padding: '10px' }}>
                        <div className="course-card">
                            <img src={course.imageURL} alt={course.name} style={{ width: '100%', height: '100px', borderRadius: '5px 5px 0 0', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' , margin:'4px'}} />
                            <div className="course-details">
                                <p className="course-name">{course.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default CoursesCarousel;
