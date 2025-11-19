import { style } from "@vanilla-extract/css";

export const formContainer = style({
    maxWidth: '22rem',
    margin: '0 auto',
    marginTop: '2rem',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
});

export const title = style({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
});

export const inputField = style({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
});

export const label = style({
    marginBottom: '0.5rem',
    fontWeight: '500',
}); 

export const input = style({
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    selectors: {
        '&:focus': {
            outline: 'none',
            borderColor: '#007BFF',
    }, 
    },
});

export const buttonContainer = style({
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
});

export const loginButton = style({
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: 'none',
    backgroundColor: '#007BFF',
    fontSize: '1rem',
    color: '#fff',
    cursor: 'pointer',
    selectors: {
        '&:disabled': {
            backgroundColor: '#ccc',
            cursor: 'not-allowed',
        },
        '&:hover:not(:disabled)': {
            backgroundColor: '#0056b3',
        },
    },
});

export const signUpButton = style({
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: '1px solid #007BFF',
    backgroundColor: '#fff',
    fontSize: '1rem',
    color: '#007BFF',
    cursor: 'pointer',
    selectors: {
        '&:hover': {
            backgroundColor: '#e6f0ff',
        },
    },
});

export const errorText = style({
    color: 'red',
    marginTop: '1rem',
    textAlign: 'center',
});