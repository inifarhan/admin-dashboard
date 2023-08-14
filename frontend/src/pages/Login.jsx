import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await axios.post("http://localhost:5000/auth/login", {
        email,
        password
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
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
          <Button
            type='submit'
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
          }}>
            Login
          </Button>
        </form>

        <Typography sx={{
          mt: 2
        }}>
          Dont have any account? <Link to="/register" >Register</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
