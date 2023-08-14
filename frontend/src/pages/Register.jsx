import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios"

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
        confirmPassword
      })

      navigate("/")
    } catch (error) {
      setMessage(error.response.data.message)
    }
  };

  return (
    <Container maxWidth="sm" >
      <Box sx={{
        boxShadow: 3,
        p: 4,
        mt: 10,
        borderRadius: "16px"
      }}>
        <Typography variant="h4" gutterBottom sx={{
          fontWeight: 500
        }}>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <Typography
            variant='subtitle1'
            sx={{
              color: "red"
            }}
          >
            {message}
          </Typography>
          <TextField
            required
            label="Username"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            required
            label="Email"
            type='email'
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            required
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            required
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
          <Button
            type='submit'
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
          }}>
            Register
          </Button>
        </form>

        <Typography sx={{
          mt: 2
        }}>
          Already have an account? <Link to="/login" >Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
