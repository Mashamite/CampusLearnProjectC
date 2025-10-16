import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Topics(){
  const [topics,setTopics] = useState([])
  const [loading,setLoading] = useState(true)
  const API = (import.meta.env.VITE_API_BASE || '')

  useEffect(()=> {
    axios.get(API + '/topics')
      .then(r=> setTopics(r.data))
      .catch(e=> console.error(e))
      .finally(()=> setLoading(false))
  },[])

  if (loading) return <div>Loading topics...</div>
  if (!topics.length) return <div className="text-muted">No topics yet.</div>

  return (
    <div>
      <h3>Topics</h3>
      <div className="row">
        {topics.map(t=> (
          <div className="col-md-6" key={t.id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{t.title}</h5>
                <p className="text-muted">{t.description}</p>
                <Link to={'/topics/'+t.id} className="btn btn-sm btn-outline-primary">Open</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
