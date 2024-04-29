import { createTheme } from '@mui/material/styles';

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
  backgroundImage: `url('../src/images/Background2.webp')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

export default theme;






