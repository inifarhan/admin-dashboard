import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography
} from '@mui/material';
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()

    try {
      await axios.delete("http://localhost:5000/auth/logout")

      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button onClick={handleLogout} variant='contained' color="error">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar