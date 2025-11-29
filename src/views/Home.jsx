import React, { useState, useMemo } from 'react'

export default function Home({ restaurants, onSelect, onNavigate }){
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return restaurants
    return restaurants.filter(r => (r.name + ' ' + (r.description||'')).toLowerCase().includes(t))
  }, [q, restaurants])

  return (
    <div className="home">
      <div className="search-bar">
        <input
          aria-label="Search restaurants"
          placeholder="Search restaurants, cuisine, or item"
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        {q ? <button className="clear" onClick={()=>setQ('')}>✕</button> : <div className="search-icon">🔎</div>}
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <h2 style={{margin:0}}>Restaurants near you</h2>
      </div>

      <div className="home-grid">
        {filtered.map(r => (
          <div key={r.id} className="home-card" onClick={()=>onSelect(r)}>
            <div className="home-thumb" />
            <div className="home-meta">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div>
                  <div className="home-title">{r.name}</div>
                  <div className="muted">{r.description}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontWeight:700}}>{r.rating}★</div>
                  <div className="muted">{r.distance} mi</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
