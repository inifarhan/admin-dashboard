import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Verify from "./pages/Verify"
import AddProduct from "./pages/AddProduct"
import EditProduct from "./pages/EditProduct"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
        <Route path="/dashboard/:userId/new" element={<AddProduct />} />
        <Route path="/dashboard/:userId/edit/:productId" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App