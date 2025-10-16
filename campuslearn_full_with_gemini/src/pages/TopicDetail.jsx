import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function TopicDetail(){
  const { id } = useParams()
  const [topic,setTopic] = useState(null)
  const API = (import.meta.env.VITE_API_BASE || '')

  useEffect(()=> {
    axios.get(API + '/topics/' + id)
      .then(r=> setTopic(r.data))
      .catch(e=> console.error(e))
  },[id])

  if (!topic) return <div>Loading...</div>
  return (
    <div>
      <h3>{topic.title}</h3>
      <p className="text-muted">{topic.description}</p>
      <h5>Materials</h5>
      <ul>
        {(topic.materials||[]).map(m=> <li key={m.id}><a href={m.url} target="_blank" rel="noreferrer">{m.title}</a></li>)}
      </ul>
    </div>
  )
}
