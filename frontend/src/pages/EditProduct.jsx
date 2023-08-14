import { useEffect, useState } from 'react';
import { Button, TextField, Container, Typography, Box, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"
import jwt_decode from "jwt-decode"

const EditProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    refreshToken()
    getProductById()
  }, [])

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);

      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.log(error)
    }
  };

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date()

    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get("http://localhost:5000/token");
      config.headers.Authorization= `Bearer ${response.data.accessToken}`
      setToken(response.data.accessToken);

      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    }

    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const getProductById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/${params.userId}/products/${params.productId}`)

      setName(response.data.name)
      setPrice(response.data.price)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axiosJWT.put(`http://localhost:5000/${params.userId}/products/${params.productId}`, {
        name,
        price
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      navigate(`/dashboard/${params.userId}`)
    } catch (error) {
      console.log(error)
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
          fontWeight: 500,
          textAlign: "center"
        }}>
          Edit product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            label="Product name"
            type='text'
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            required
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
          />
          <Stack direction="row" spacing={4} mt={2}>
            <Button
              onClick={() => navigate(`/dashboard/${params.userId}`)}
              variant="contained"
              color="error"
              fullWidth
              sx={{
                mt: 3,
            }}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant="contained"
              color="success"
              fullWidth
              sx={{
                mt: 3,
            }}>
              Update
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default EditProduct;
