import React, { useState } from 'react'

export default function Menu({ categories, onAdd, selectedRestaurant, onRedeem, onNavigate }){
  const pointsAvailable = selectedRestaurant ? parseInt(localStorage.getItem(`pointsMap_${selectedRestaurant.id}`) || selectedRestaurant.demoCustomerPoints) : 0
  const [active, setActive] = useState(categories && categories[0] ? categories[0].id : null)

  const goToCategory = (id) => {
    if (id === 'order'){
      // navigate back to ordering page root
      if (onNavigate) onNavigate('ordering')
      return
    }
    setActive(id)
    const el = document.getElementById(`cat_${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="menu">
      {/* Top categories row (shows on larger devices) */}
      <div className="categories-row">
        <button className={`category-pill ${active==='order' ? 'active':''}`} onClick={()=>goToCategory('order')}>Order</button>
        {categories.map(cat => (
          <button key={cat.id} className={`category-pill ${active===cat.id ? 'active':''}`} onClick={()=>goToCategory(cat.id)}>{cat.name}</button>
        ))}
      </div>

      {categories.map(cat => (
        <section key={cat.id} className="category" id={`cat_${cat.id}`}>
          <h3>{cat.name}</h3>
          <div className="items-grid">
            {cat.items.map(it => (
              <div key={it.id} className="menu-card">
                <div className="menu-card-body">
                  <div className="thumb" aria-hidden />
                  <div className="meta">
                    <strong className="title">{it.name}</strong>
                    <div className="desc muted">{it.description || ''}</div>
                    <div className="price">${it.price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="menu-card-actions">
                  <button className="add" onClick={()=>onAdd(it)}>Add</button>
                  {selectedRestaurant && pointsAvailable >= selectedRestaurant.pointsRate && (
                    <button className="redeem" onClick={()=>onRedeem && onRedeem(selectedRestaurant.id, it)}>Redeem</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
