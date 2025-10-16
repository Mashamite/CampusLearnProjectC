import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Navbar(){
  const auth = useAuth()
  const nav = useNavigate()
  const onSignOut = () => { auth.signout(); nav('/signin') }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand" to="/">CampusLearn</Link>
        <div>
          {auth.user ? (
            <>
              <Link className="btn btn-sm btn-outline-primary me-2" to="/topics">Topics</Link>
              <Link className="btn btn-sm btn-outline-secondary me-2" to="/forum">Forum</Link>
              <Link className="btn btn-sm btn-outline-success me-2" to="/messages">Messages</Link>
              <Link className="btn btn-sm btn-primary" to="/profile">Profile</Link>
              <button className="btn btn-sm btn-link ms-2" onClick={onSignOut}>Sign out</button>
            </>
          ) : (
            <Link className="btn btn-primary" to="/signin">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
