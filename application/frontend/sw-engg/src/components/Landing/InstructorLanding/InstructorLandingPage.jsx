import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faUpload, faComments } from '@fortawesome/free-solid-svg-icons';
import './InstructorLandingPage.css'
import Modal from '../../DiscussionForum/Modal';
import apiService from '../../../services/apiService'; // Ensure the correct path
import {Box, Paper, Typography} from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentIcon from '@mui/icons-material/Comment';

const PopularFilesCarousel = ({ files }) => {
  // Same settings as in StudentLandingPage
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <Slider {...settings}>
      {files.map((file) => (
        <div key={file.id} className="file-card">
          <img src={file.thumbnail} alt={file.title} className="file-thumbnail" />
          <div className="file-info">
            <h3>{file.title}</h3>
            <p>{file.description}</p>
            <div className="file-meta">
              <span>{file.category}</span>
              <span>{file.fileSize}</span>
              <span>{file.uploadDate}</span>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

const InstructorLandingPage = (props) => {
  const [files, setFiles] = useState([]);
  const Name = sessionStorage.getItem('firstName'); // Fetch the name from sessionStorage
  const [activeTab, setActiveTab] = useState('tab1');
  const { modalOpen, setModal } = props;
  const [discussions, setDiscussions] = useState([]);
  const navigate = useNavigate();


  const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
  const closeModal = () => {
        setModal(false);
    };

  const fetchFiles = async () => {
    try {
      const filesData = await apiService.fetchAllFiles();
      setFiles(filesData.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      // Display error message to the user
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchDiscussionsFromApi();
  }, []);

    const fetchDiscussionsFromApi = async () => {
        try {
            const response = await apiService.fetchDiscussions();
            if (response && response.discussion && response.replies) {
                const discussionsWithRepliesCount = response.discussion.map(discussion => {
                    const repliesCount = response.replies.filter(reply => reply.discussion_id === discussion.id).length;
                    return {...discussion, repliesCount};
                });
                setDiscussions(discussionsWithRepliesCount);
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };
  
     const handleDiscussionClick = (id) => {
        navigate(`/discussion/${id}`);
    };


  return (
    <div className="instructor-landing-page">
      <div>
        {modalOpen && (
                <Modal toggleModal={() => props.toggleModal()} modalType={props.modalType}>
                </Modal>
            )}
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tab1')}
                >
                    Content
                </button>
                <button
                    className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tab2')}
                >
                    Discussions
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'tab1' ? (
                    <div>
                        <h1>Content of Tab 1</h1>
                        <p>This is the content for Tab 1. You can put any components or content here.</p>
                    </div>
                ) : (
                    <div>
                        <Box sx={{maxWidth: 800, margin: 'auto', mt: 2}}>
            {discussions.map((discussion) => (
                <Paper key={discussion.id} elevation={2} sx={{p: 2, mb: 2, cursor: 'pointer'}}
                       onClick={() => handleDiscussionClick(discussion.id)}>
                    <Typography variant="h6" sx={{mb: 1}}>{discussion.title}</Typography>
                    <Typography variant="body2" sx={{mb: 2}}>{discussion.content}</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <ThumbUpAltIcon sx={{mr: 0.5, color: 'primary.main'}}/>

                        <Typography sx={{mx: 2}}>{discussion.likes - discussion.dislikes}</Typography>
                        <ThumbDownAltIcon sx={{mr: 0.5, color: 'secondary.main'}}/>

                        <CommentIcon sx={{ml: 2, mr: 0.5, color: 'action.active'}}/>
                        <Typography>{discussion.repliesCount}</Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
                    </div>
                )}
            </div>
        </div>

      <footer className="instructor-footer">
        <p>© 2024 Your Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Custom arrow components for Slider
const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  );
};

export default InstructorLandingPage;





