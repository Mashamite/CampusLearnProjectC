import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Forum(){
  const [posts,setPosts] = useState([])
  const API = (import.meta.env.VITE_API_BASE || '')
  useEffect(()=> {
    axios.get(API + '/forum/posts').then(r=> setPosts(r.data)).catch(e=> console.error(e))
  },[])
  return (
    <div>
      <h3>Forum</h3>
      <div className="list-group">
        {posts.map(p=> (
          <Link key={p.id} to={'/forum/'+p.id} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{p.title}</h5>
              <small>{p.anonymous? 'Anonymous' : p.author_name}</small>
            </div>
            <p className="mb-1 text-truncate">{p.content}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
