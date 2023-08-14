import axios from "axios";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken)

      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      navigate("/login");
    }
  };

  const getProductsById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/${params.userId}/products`);

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date()

    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get("http://localhost:5000/token")
      config.headers.Authorization = `Bearer ${response.data.accessToken}`
      setToken(response.data.accessToken)

      const decoded = jwt_decode(response.data.accessToken)
      setExpire(decoded.exp)
    }

    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const handleDelete = async (productId) => {
    try {
      if (confirm("Are you sure want to delete this product?") === false) {
        return
      }

      await axiosJWT.delete(`http://localhost:5000/${params.userId}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    refreshToken();
    getProductsById();
  }, []);

  return (
    <div>
      <Navbar />
      <Container>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "medium",
            mt: 5,
          }}
        >
          Welcome Back: {name}
        </Typography>

        <Link to={`/dashboard/${params.userId}/new`}>
          <Button variant="contained" color="success" startIcon={<AddIcon />} sx={{ mb: 2 }}>
            Add Product
          </Button>
        </Link>
        <TableContainer elevation={3} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#3d3c3c" }}>
              <TableRow>
                <TableCell align="center" sx={{ color: "white" }}>
                  No
                </TableCell>
                <TableCell sx={{ color: "white" }}>Product</TableCell>
                <TableCell sx={{ color: "white" }}>Price</TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={2}>
                      <Button onClick={() => navigate(`/dashboard/${params.userId}/edit/${product.id}`)} variant="contained" startIcon={<EditIcon />} aria-label="edit product">
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(product.id)} variant="contained" color="error" startIcon={<DeleteIcon />} aria-label="edit product">
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default Dashboard;
