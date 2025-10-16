import React, { createContext, useContext, useState } from 'react'
import API from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const existing = JSON.parse(localStorage.getItem('user') || 'null')
  const [user, setUser] = useState(existing)
  const [token, setToken] = useState(localStorage.getItem('access_token') || null)

  const signin = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password })

      localStorage.setItem('access_token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setToken(res.data.token)
      setUser(res.data.user)

      return { ok: true }
    } catch (err) {
      console.error('Login failed', err.response?.data || err.message)
      return { ok: false, message: err.response?.data?.message || 'Login failed' }
    }
  }

  const signout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  return <AuthContext.Provider value={{ user, token, signin, signout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
