import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import apiService from '../../services/apiService';
import {Box, Paper, Typography} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentIcon from "@mui/icons-material/Comment";

const MyDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');
  const [discussionToEdit, setDiscussionToEdit] = useState(null);

  useEffect(() => {
    fetchMyDiscussionsFromApi();
  }, []);



  const fetchMyDiscussionsFromApi = async () => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const response =  await apiService.fetchMyDiscussions(userEmail);
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

  const deleteDiscussion = async (id) => {
    try {
      await apiService.deleteDiscussion(id);
      setDiscussions(discussions.filter((discussion) => discussion.id !== id));
    } catch (error) {
      console.error('Error deleting discussion:', error);
    }
  };



  const handleEditClick = (discussion) => {
    setIsEditing(true);
    setEditedTitle(discussion.title);
    setEditedText(discussion.text);
    setDiscussionToEdit(discussion);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle('');
    setEditedText('');
    setDiscussionToEdit(null);
  };

  const handleSaveEdit = async () => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const updatedDiscussion = await apiService.updateDiscussion(discussionToEdit.id, editedTitle, editedText, userEmail);
      const updatedDiscussions = discussions.map((discussion) =>
        discussion.id === updatedDiscussion.id ? updatedDiscussion : discussion
      );
      setDiscussions(updatedDiscussions);
      setIsEditing(false);
      setEditedTitle('');
      setEditedText('');
      setDiscussionToEdit(null);
    } catch (error) {
      console.error('Error updating discussion:', error);
    }
  };

  const handleDiscussionClick = (id) => {
    navigate(`/discussion/${id}`);
  };

  return (
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
  );
};

export default MyDiscussions;