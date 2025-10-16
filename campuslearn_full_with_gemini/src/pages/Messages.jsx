import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Messages(){
  const [convos,setConvos] = useState([])
  const API = (import.meta.env.VITE_API_BASE || '')
  useEffect(()=> {
    axios.get(API + '/messages').then(r=> setConvos(r.data)).catch(e=> console.error(e))
  },[])
  return (
    <div>
      <h3>Messages</h3>
      <ul className="list-group">
        {convos.map(c=> <li key={c.id} className="list-group-item">{c.with_name || c.other_user}</li>)}
      </ul>
    </div>
  )
}
