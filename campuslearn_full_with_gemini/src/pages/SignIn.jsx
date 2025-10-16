import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function SignIn(){
  const auth = useAuth()
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    const r = await auth.signin(email, password)
    if (r.ok) nav('/')
    else setErr(r.message || 'Invalid credentials')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm mt-5">
          <div className="card-body">
            <h4 className="card-title">Sign in</h4>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@belgiumcampus.ac.za" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              {err && <div className="alert alert-danger">{err}</div>}
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary">Sign in</button>
              </div>
            </form>
            <div className="text-muted mt-3">Use your campus email.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
