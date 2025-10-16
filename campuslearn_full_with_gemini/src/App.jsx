import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Chatbot from './chatbot/Chatbot'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import TopicDetail from './pages/TopicDetail'
import Forum from './pages/Forum'
import Thread from './pages/Thread'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Upload from './pages/Upload'
import { AuthProvider, useAuth } from './utils/auth'

function Protected({ children }){
  const auth = useAuth()
  if (!auth.user) return <Navigate to='/signin' replace />
  return children
}

export default function App(){
  return (
    <AuthProvider>      <Chatbot />
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/topics" element={<Protected><Topics /></Protected>} />
          <Route path="/topics/:id" element={<Protected><TopicDetail /></Protected>} />
          <Route path="/forum" element={<Protected><Forum /></Protected>} />
          <Route path="/forum/:id" element={<Protected><Thread /></Protected>} />
          <Route path="/messages" element={<Protected><Messages /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/upload" element={<Protected><Upload /></Protected>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
