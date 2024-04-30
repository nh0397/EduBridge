import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Button, Avatar, Menu, MenuItem } from '@mui/material';
import theme from '../../theme'; // Make sure this path is correct
import logo from '../../images/eduBridge.webp';
import backgroundImage from '../../images/Backgroundimage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faPlus, faBook, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import './Navbar.css'

function Navbar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const userRole = sessionStorage.getItem('role');
    const firstName = sessionStorage.getItem('firstName'); // Fetching firstName from sessionStorage
    const lastName = sessionStorage.getItem('lastName'); // Fetching lastName from sessionStorage
    const navigate = useNavigate();
    const homePath = userRole === 'instructor' ? '/instructor' : '/student'; // Define homePath based on userRole

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getInitials = (firstName, lastName) => {
        return firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : 'U';
    };

    const toggleCreateDiscussion = () => {
        console.log("Toggle Create Discussion Modal");
    };

    const buttonStyle = {
        fontWeight: 'bold',
        borderRadius: '50px',
        textTransform: 'none',
        fontSize: '16px',
        padding: '8px 32px',
        margin: '0 4px', // Add space around the buttons
        display: 'flex', // Ensure button content is displayed as flex
        alignItems: 'center', // Align button content vertically
        gap: '8px', // Add space between icon and text
        color: 'white',
        whiteSpace: 'nowrap',
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',

        }}>
            <Link to={homePath} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', marginLeft: 16 }}>
                <Avatar sx={{ width: 75, height: 75 }}>
                    <img src={logo} alt="App Logo" style={{ width: '100%' }} />
                </Avatar>
            </Link>
            <div> 
				<TextField
				variant="standard"
				margin="normal"
				className='search-field'
                size="small"
                placeholder="Search"
				InputProps={{
					disableUnderline: true,
					  style: {
						height:40,
						paddingLeft: 15
					}
				}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
			</div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {userRole?.toLowerCase() === 'instructor' && (
                    <Button onClick={() => navigate('/upload')} sx={buttonStyle}>
                        <FontAwesomeIcon icon={faCloudUploadAlt} size="sm" />
                        <Typography variant="body1">Upload New Content</Typography>
                    </Button>
                )}
                <Button onClick={toggleCreateDiscussion} sx={buttonStyle}>
                    <FontAwesomeIcon icon={faPlus} size="sm" />
                    <Typography variant="body1">Create Discussion</Typography>
                </Button>
                <Button onClick={() => navigate('/courses')} sx={buttonStyle}>
                    <FontAwesomeIcon icon={faBook} size="sm" />
                    <Typography variant="body1">Courses</Typography>
                </Button>
                <Button onClick={handleClick} sx={buttonStyle}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 50, height: 50, alignItems: 'right', marginLeft:-16, marginRight:-16}}>
                        {getInitials(firstName, lastName)}
                    </Avatar>
                </Button>
                <Menu
    className='menu-box'
    id="account-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
    MenuListProps={{
        'aria-labelledby': 'account-button',
    }}
    PaperProps={{
        style: {
            width: '300px', // Increase the width as needed
            padding: '20px',  // Optional: add some padding around the items
			paddingBottom:'0px'
        }
    }}
>
    <div className='name-box'>
        <div>
            <Avatar 
                sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    width: 60,  // Increased width
                    height: 60, // Increased height
                }}
            >
                {getInitials(firstName, lastName)}
            </Avatar>
        </div>
        <div>
            <div className='name-text'>
            <div className='firstName'>{sessionStorage.getItem("firstName")}</div>
            <div className='lastName'>{sessionStorage.getItem("lastName")}</div>
        </div>
        <div>
            {sessionStorage.getItem('userEmail')}
        </div>
        <div>
            {userRole[0].toUpperCase()}{userRole.substring(1, userRole.length)}
        </div>
        </div>
    </div>
    <MenuItem onClick={handleLogout} className='logout-text'>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
            Logout
    </MenuItem>
</Menu>

            </Box>
        </Box>
    );
}

export default Navbar;












