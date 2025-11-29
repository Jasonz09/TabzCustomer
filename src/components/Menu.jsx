import React from 'react'

export default function Menu({ categories, onAdd, selectedRestaurant, onRedeem }){
  const pointsAvailable = selectedRestaurant ? parseInt(localStorage.getItem(`pointsMap_${selectedRestaurant.id}`) || selectedRestaurant.demoCustomerPoints) : 0

  return (
    <div className="menu">
      {categories.map(cat => (
        <section key={cat.id} className="category">
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
