import React, { useState } from 'react'

export default function Cart({ cart, onClear, restaurant, onRedeem, dineInCode, validDineIn, orderingMode, orderingInputCode }){
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
    <div className="cart-box cart-panel">
      <div className="ordered-items">
        <h4>Ordered Items <span className="count">{cart.length.toString().padStart(2,'0')}</span></h4>
        <div className="items-list">
          {cart.length===0 && <div className="empty">No items</div>}
          {cart.map((i, idx)=> (
            <div key={i.id} className={`ordered-item ${idx===0? 'active':''} ${i.redeemed? 'redeemed':''}`}>
              <div className="oi-left">
                <div className="oi-qty">{i.qty}×</div>
                <div className="oi-title">{i.name} {i.redeemed && <small className="muted">(redeemed)</small>}</div>
              </div>
              <div className="oi-price">{i.redeemed ? 'Free' : `$${(i.price*i.qty).toFixed(2)}`}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="payment-summary card">
        <h5>Payment Summary</h5>
        <div className="pm-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
        <div className="pm-row"><span>Tax</span><strong>${tax.toFixed(2)}</strong></div>
        <div className="pm-total"><span>Total Payable</span><strong>${total.toFixed(2)}</strong></div>

        <div style={{marginTop:8}}>
          {orderingMode === 'dinein' && (
            <div style={{marginBottom:8}}>
              {!orderingInputCode ? <small style={{color:'#b02a37'}}>Table code required for Dine In</small> : (!validDineIn ? <small style={{color:'#b02a37'}}>Table code invalid</small> : <small style={{color:'#0b6b66'}}>Table code valid</small>)}
            </div>
          )}
          <button className="place large" disabled={orderingMode === 'dinein' && (!orderingInputCode || !validDineIn)}>Place Order</button>
        </div>
      </div>
    </div>
  )
}
