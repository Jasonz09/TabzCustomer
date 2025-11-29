import React, { useState, useEffect, useMemo } from 'react'

export default function RestaurantDetail({ restaurant, onBack, onStartOrdering, setDineInCode, currentDineInCode }){
  const [mode, setMode] = useState(null) // 'dinein' | 'takeout'
  const [localCode, setLocalCode] = useState(currentDineInCode || '')

  useEffect(()=>{
    setLocalCode(currentDineInCode || '')
  }, [currentDineInCode])

  const isValidCode = useMemo(()=>{
    if (!localCode) return false
    return restaurant.tableCodes && restaurant.tableCodes.includes(localCode)
  }, [localCode, restaurant.tableCodes])

  return (
    <div className="restaurant-detail modern">
      <div className="rd-top">
        <button className="back" onClick={onBack}>← Back</button>
        <div className="rd-title">
          <h1>{restaurant.name}</h1>
          <div className="muted">{restaurant.description}</div>
        </div>
      </div>

      <section className="modes card">
        <h3>How would you like to receive your order?</h3>
        <div className="mode-buttons modern">
          <button className={`mode pill ${mode==='dinein' ? 'active':''}`} onClick={()=>setMode('dinein')}>Dine In</button>
          <button className={`mode pill ${mode==='takeout' ? 'active':''}`} onClick={()=>setMode('takeout')}>Takeout</button>
        </div>

        {mode==='dinein' && (
          <div className="dinein-card">
            <div className="dinein-note muted">Enter the table code from the server to link this order to a table.</div>

            <div className="dinein-input-row">
              <input className="dinein-input" placeholder="Enter table code" value={localCode} onChange={e=>setLocalCode(e.target.value)} />
              <button className="save" onClick={()=>setDineInCode && setDineInCode(localCode)}>Save</button>
            </div>

            <div className="dinein-status">
              {localCode ? (
                isValidCode ? <span className="badge valid">Code valid</span> : <span className="badge invalid">Code not found</span>
              ) : <span className="muted">No table code entered</span>}
            </div>
          </div>
        )}

        <div style={{marginTop:18}}>
          <button className="place" disabled={!mode} onClick={()=>onStartOrdering(mode)}>Start ordering</button>
        </div>
      </section>
    </div>
  )
}
