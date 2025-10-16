import React, { useState } from 'react'
import axios from 'axios'

export default function Upload(){
  const [title,setTitle]=useState('')
  const [file,setFile]=useState(null)
  const API = (import.meta.env.VITE_API_BASE || '')

  const submit = ()=> {
    if (!file) return alert('Select a file')
    const fd = new FormData()
    fd.append('title', title)
    fd.append('file', file)
    axios.post(API + '/materials/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }})
      .then(()=> alert('Uploaded'))
      .catch(e=> console.error(e))
  }

  return (
    <div>
      <h3>Upload Material</h3>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <div className="mb-3">
        <input type="file" onChange={e=> setFile(e.target.files[0])} />
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-success" onClick={submit}>Upload</button>
      </div>
    </div>
  )
}
