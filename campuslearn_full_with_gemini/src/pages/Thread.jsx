import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function Thread(){
  const { id } = useParams()
  const [post,setPost] = useState(null)
  const [text,setText] = useState('')
  const API = (import.meta.env.VITE_API_BASE || '')

  useEffect(()=> {
    axios.get(API + '/forum/posts/' + id).then(r=> setPost(r.data)).catch(e=> console.error(e))
  },[id])

  const addComment = ()=> {
    axios.post(API + '/forum/posts/' + id + '/comments', { content: text })
      .then(()=> { setText(''); return axios.get(API + '/forum/posts/' + id) })
      .then(r=> setPost(r.data))
      .catch(e=> console.error(e))
  }

  if (!post) return <div>Loading...</div>
  return (
    <div>
      <h3>{post.title}</h3>
      <p className="text-muted">By {post.anonymous? 'Anonymous' : post.author_name}</p>
      <p>{post.content}</p>
      <hr />
      <h5>Comments</h5>
      <ul className="list-group mb-3">
        {(post.comments||[]).map(c=> <li key={c.id} className="list-group-item">{c.content}</li>)}
      </ul>
      <textarea className="form-control mb-2" value={text} onChange={e=>setText(e.target.value)} />
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" onClick={addComment}>Add Comment</button>
      </div>
    </div>
  )
}
