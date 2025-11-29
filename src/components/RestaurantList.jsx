import React from 'react'

export default function RestaurantList({ restaurants, selected, onSelect }){
  return (
    <div className="restaurant-list">
      {restaurants.map(r => (
        <div
          key={r.id}
          className={`restaurant-card ${(selected && selected.id===r.id) ? 'active':''}`}
          onClick={()=>onSelect(r)}
        >
          <div className="rc-left">
            <div className="rc-thumb" aria-hidden />
            <div>
              <div className="rc-name">{r.name}</div>
              <div className="rc-desc muted">{r.description}</div>
            </div>
          </div>
          <div className="rc-right" style={{textAlign:'right'}}>
            <div style={{fontWeight:700}}>{r.rating}★</div>
            <div className="muted">{r.distance} mi</div>
            <div style={{marginTop:6}}><div className="badge">{r.demoCustomerPoints} pts</div></div>
          </div>
        </div>
      ))}
    </div>
  )
}
