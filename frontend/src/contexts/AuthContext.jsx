import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Decode token to get user info (simple JWT decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.id, role: payload.role })
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token } = response.data
      localStorage.setItem('token', token)
      
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({ id: payload.id, role: payload.role })
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const register = async (username, email, password, role = 'user') => {
    try {
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password,
        role 
      })
      const { token } = response.data
      localStorage.setItem('token', token)
      
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({ id: payload.id, role: payload.role })
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed. Please try again.'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

