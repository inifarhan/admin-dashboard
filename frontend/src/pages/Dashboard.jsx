import axios from "axios";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [keyword, setKeyword] = useState("")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(5)
  const [rows, setRows] = useState(0)
  const [totalPage, setTotalPage] = useState(0)

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    refreshToken();
  }, [])

  useEffect(() => {
    getProductsById();
  }, [keyword, page]);

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
      const response = await axios.get(
        `http://localhost:5000/${params.userId}/products?search_query=${keyword}&page=${page}&limit=${limit}`
      );

      setProducts(response.data.result);
      setRows(response.data.totalRows);
      setTotalPage(response.data.totalPage);
    } catch (error) {
      console.log(error);
    }
  };

  const changePage = (event, page) => {
    setPage(page - 1)
  } 

  const onSearch = (e) => {
    e.preventDefault()
    setPage(0)
    setKeyword(query)
  }

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

  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 8}}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "medium",
            mb: 3,
          }}
        >
          Welcome Back: {name}
        </Typography>

        <Link to={`/dashboard/${params.userId}/new`}>
          <Button variant="contained" color="success" startIcon={<AddIcon />} sx={{ mb: 2 }}>
            Add Product
          </Button>
        </Link>
        <form onSubmit={onSearch}>
          <Stack direction="row" mb={1}>
            <TextField
              fullWidth
              label="Search something"
              type="text"
              variant="filled"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="contained">
              <SearchIcon />
            </Button>
          </Stack>
        </form>
        <TableContainer elevation={3} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#3d3c3c" }}>
              <TableRow>
                {/* <TableCell align="center" sx={{ color: "white" }}>
                  No
                </TableCell> */}
                <TableCell sx={{ color: "white" }}>Product</TableCell>
                <TableCell sx={{ color: "white" }}>Price</TableCell>
                <TableCell align="right" sx={{ color: "white", pr: 13 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {index + }
                  </TableCell> */}
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="end" spacing={2}>
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
        <Stack alignItems="center" mt="1rem">
          <Pagination
            key={rows}
            onChange={changePage}
            count={totalPage}
            shape="rounded"
            color="primary"
            size="large"
          />
        </Stack>
      </Container>
    </div>
  );
};

export default Dashboard;
