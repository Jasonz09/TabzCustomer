import React, { useState } from 'react'

export default function Cart({ cart, onClear, restaurant, onRedeem, dineInCode, validDineIn }){
  const [usePoints, setUsePoints] = useState(false)

  const subtotal = cart.reduce((s,i)=>s + (i.price || 0) * i.qty, 0)
  const tax = +(subtotal * 0.08).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  // read live points from localStorage if available (demo)
  const pointsKey = restaurant ? `pointsMap_${restaurant.id}` : null
  let pointsAvailable = 0
  let isGroup = false
  if (restaurant){
    if (restaurant.corpCode){
      const gKey = `pointsGroup_${restaurant.corpCode}`
      pointsAvailable = parseInt(localStorage.getItem(gKey) || '0')
      isGroup = true
    } else {
      pointsAvailable = parseInt(localStorage.getItem(pointsKey) || restaurant.demoCustomerPoints)
    }
  }
  const pointsCanCover = restaurant ? pointsAvailable >= restaurant.pointsRate : false

  return (
    <div className="cart-box">
      <h3>Cart</h3>
      {cart.length===0 && <div className="empty">No items</div>}
      {cart.map(i=> (
        <div key={i.id} className={`cart-item ${i.redeemed? 'redeemed':''}`}>
          <div>{i.qty}× {i.name} {i.redeemed && <small className="muted">(redeemed)</small>}</div>
          <div>{i.redeemed ? <strong>Free</strong> : `$${(i.price*i.qty).toFixed(2)}`}</div>
        </div>
      ))}

      <div className="summary">
        <div>Subtotal <strong>${subtotal.toFixed(2)}</strong></div>
        <div>Tax <strong>${tax.toFixed(2)}</strong></div>
        <div className="total">Total <strong>${total.toFixed(2)}</strong></div>
      </div>

      <div className="points-section">
        <label>
          <input type="checkbox" checked={usePoints} onChange={e=>setUsePoints(e.target.checked)} /> Redeem points
        </label>
        {usePoints && (
          <div className="redeem">
            <div>Points available: <strong>{pointsAvailable}</strong> {isGroup && <small className="muted">(group)</small>}</div>
            <div>Points needed per free item: <strong>{restaurant.pointsRate}</strong></div>
            <div className="redeem-note muted">Pick a menu item's "Redeem" button to use points for that item.</div>
            <button disabled={!pointsCanCover} onClick={()=>onRedeem && onRedeem(restaurant.id)} style={{display:'none'}}>Redeem for free item</button>
          </div>
        )}

        <div className="dinein-status">
          <small>Dine-in code: {dineInCode || '—'}</small>
          <div>{dineInCode ? (validDineIn ? <span style={{color:'green'}}>Valid table code</span> : <span style={{color:'crimson'}}>Invalid code for this restaurant</span>) : <span style={{color:'#666'}}>Not using dine-in</span>}</div>
        </div>
      </div>

      <div className="actions">
        <button className="place">Place Order</button>
        <button onClick={onClear} className="clear">Clear</button>
      </div>
    </div>
  )
}
