import React, { useState, useMemo } from 'react'

export default function Home({ restaurants, onSelect }){
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

      <h2>Restaurants near you</h2>

      <div className="home-grid">
        {filtered.map(r => (
          <div key={r.id} className="home-card" onClick={()=>onSelect(r)}>
            <div className="home-thumb" />
            <div className="home-meta">
              <div className="home-title">{r.name}</div>
              <div className="muted">{r.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
