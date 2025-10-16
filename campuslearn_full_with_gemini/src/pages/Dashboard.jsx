import React from 'react'

export default function Dashboard(){
  return (
    <div>
      <h2>Welcome to CampusLearn</h2>
      <p className="text-muted">Use the top navigation to access Topics, Forum, Messages and Profile.</p>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="card-title">My Topics</h5>
            <p className="text-muted">Subscribed topics will appear here.</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="card-title">Recent Forum</h5>
            <p className="text-muted">Recent public discussions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
