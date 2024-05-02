import {React, useState} from "react";
import {BrowserRouter as Router, Route, Routes, useLocation, Navigate} from "react-router-dom";
import Login from "./components/login/Login";
import Signup from './components/signup/Signup';
import StudentLandingPage from "./components/Landing/StudentLanding/StudentLandingPage";
import InstructorLandingPage from "./components/Landing/InstructorLanding/InstructorLandingPage";
import UploadContentPage from './components/Landing/InstructorLanding/UploadContentPage';
import AdminPage from "./components/Landing/Admin/AdminPage";
import DiscussionForum from './components/DiscussionForum/DiscussionForum';
import DiscussionList from './components/DiscussionForum/DiscussionList';
import DiscussionDetail from './components/DiscussionForum/DiscussionDetail';
import ProtectedRoute from "./components/routing/ProtectedRoute";
import StudentRoute from "./components/routing/StudentRoute";
import InstructorRoute from "./components/routing/InstructorRoute";
import Navbar from "./components/Navbar/Navbar";

import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import AdministratorRoute from "./components/routing/AdministratorRoute";
import MyDiscussions from './components/DiscussionForum/MyDiscussions';
import CoursesPage from "./components/CoursesPage/CoursesPage";

function App() {
    const [modalOpen, setModalState] = useState(false);
    const [modalType, setModalType] = useState("");

    const Layout = ({children}) => {
        const location = useLocation();
        const hideNavbarOnRoutes = ["/login", "/signup", '/forgot-password'];
        const showNavbar = !hideNavbarOnRoutes.includes(location.pathname);

        return (
            <>
                {showNavbar && <Navbar toggleModal={() => setModalState(!modalOpen)} modalOpen={modalOpen} modalTypeFunc={(value)=> setModalType(value)}/>}
                <div>{children}</div>
            </>
        );
    };

    return (<Router>
        <div className="app">
            <Layout/>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                {/* Protected and role-based routes for Student */}
                <Route path="/student" element={<ProtectedRoute>
                    <StudentRoute>
                        <StudentLandingPage toggleModal={() => setModalState(!modalOpen)} modalOpen={modalOpen} modalTypeFunc={(value)=> setModalType(value)} modalType={modalType}/>
                    </StudentRoute>
                </ProtectedRoute>}/>
                {/* Protected and role-based routes for Instructor */}
                <Route path="/instructor" element={
                        <InstructorLandingPage toggleModal={() => setModalState(!modalOpen)} modalOpen={modalOpen} modalTypeFunc={(value)=> setModalType(value)} modalType={modalType}/>
                    }/>
                <Route path="/instructor/upload-content" element={<ProtectedRoute>
                    <InstructorRoute>
                        <UploadContentPage/>
                    </InstructorRoute>
                </ProtectedRoute>}/>
                {/* Admin route */}
                <Route path="/admin" element={
                        <AdminPage/>
                    
                }/>
                {/* Discussion Forum routes */}
                <Route path="/forum" element={<DiscussionForum/>}/>
                <Route path="/discussions" element={<DiscussionList/>}/>
                <Route path="/discussion/:id" element={<DiscussionDetail/>}/>
                <Route path="/my-discussions" element={<MyDiscussions />} />
                {/* Courses page route */}
                <Route path="/courses" element={<CoursesPage />} />

            </Routes>
        </div>
    </Router>);
}

export default App;

