import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from "jwt-decode"

const Verify = () => {
  const navigate = useNavigate()

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token")

      const decoded = jwt_decode(response.data.accessToken)

      navigate(`/dashboard/${decoded.userId}`)
    } catch (error) {
      navigate("/login")
    }
  }

  useEffect(() => {
    refreshToken()
  })
}

export default Verify