import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Profile(){
  const [me,setMe] = useState(null)
  const API = (import.meta.env.VITE_API_BASE || '')
  useEffect(()=> { axios.get(API + '/users/me').then(r=> setMe(r.data)).catch(e=> console.error(e)) },[])
  if (!me) return <div>Loading...</div>
  return (
    <div>
      <h3>Profile</h3>
      <div className="card p-3">
        <div><strong>Name:</strong> {me.name}</div>
        <div><strong>Email:</strong> {me.email}</div>
        <div><strong>Role:</strong> {me.role}</div>
      </div>
    </div>
  )
}
