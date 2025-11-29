import React from 'react'

export default function RestaurantList({ restaurants, selected, onSelect }){
  return (
    <div className="restaurant-list">
      {restaurants.map(r => (
        <div key={r.id} className={`restaurant-card ${selected.id===r.id? 'active':''}`} onClick={()=>onSelect(r)}>
          <div className="rc-left">
            <div className="rc-thumb" aria-hidden />
            <div>
              <div className="rc-name">{r.name}</div>
              <div className="rc-desc muted">{r.description}</div>
            </div>
          </div>
          <div className="rc-right">
            <div className="badge">{r.demoCustomerPoints} pts</div>
          </div>
        </div>
      ))}
    </div>
  )
}
