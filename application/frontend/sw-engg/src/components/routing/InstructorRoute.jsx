import React from 'react';
import { Navigate } from 'react-router-dom';

const isInstructor = () => {
    return sessionStorage.getItem('isInstructor') === 'true';
};

const InstructorRoute = ({ children}) => {
    if (!isInstructor()) {
        return <Navigate to="/" />;
    }
    return children;
};

export default InstructorRoute;