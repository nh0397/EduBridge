import { createTheme } from '@mui/material/styles';
import backgroundImage from '../src/images/Background2.webp'; 

const theme = createTheme({
  palette: {
    primary: {
      main: '#005B4B', // Primary color
    },
    secondary: {
      main: '#39826A', // Secondary color
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: 0, // Remove padding
          background: 'transparent', // Make background transparent
          boxShadow: 'none', // Remove shadow if necessary
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent', // Make TextField border transparent
            },
            '&:hover fieldset': {
              borderColor: 'transparent', // Make TextField border transparent on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent', // Make TextField border transparent on focus
            },
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '10px 20px',
        },
      },
    },
  },
  backgroundImage: `url(${backgroundImage})`, // Adjust this path to your actual background image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'scroll', // Ensures the background scrolls with the content
});

export default theme;






