import React, { useState, useEffect } from 'react'
import RestaurantList from './components/RestaurantList'
import Menu from './components/Menu'
import Cart from './components/Cart'
import sampleData from './data/sample'

export default function App() {
  const [restaurants] = useState(sampleData)
  const [selected, setSelected] = useState(restaurants[0])
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')||'[]'))
  const [dineInCode, setDineInCode] = useState(() => localStorage.getItem('dineInCode') || '')

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('dineInCode', dineInCode)
  }, [dineInCode])

  // initialize per-restaurant demo points in localStorage if not present
  useEffect(() => {
    restaurants.forEach(r => {
      const key = `pointsMap_${r.id}`
      if (!localStorage.getItem(key)) localStorage.setItem(key, String(r.demoCustomerPoints))
    })
  }, [])

  // initialize corporate group balances if restaurants belong to a corpCode
  useEffect(() => {
    const codes = new Set(restaurants.map(r => r.corpCode).filter(Boolean))
    codes.forEach(code => {
      const gKey = `pointsGroup_${code}`
      if (!localStorage.getItem(gKey)) {
        // start group balance as sum of members' demo points for demo purposes
        const sum = restaurants.filter(r => r.corpCode === code).reduce((s,r)=>s + (r.demoCustomerPoints||0), 0)
        localStorage.setItem(gKey, String(sum))
      }
    })
  }, [])

  const addToCart = (item, qty=1) => {
    setCart(prev => {
      const found = prev.find(i => i.id === item.id && i.restaurantId === selected.id)
      if (found) return prev.map(i => i.id === item.id && i.restaurantId === selected.id ? {...i, qty: i.qty + qty} : i)
      return [...prev, { ...item, qty, restaurantId: selected.id }]
    })
  }

  // redeem a specific menu item for free if the customer has enough points
  const redeemPointsForFreeItem = (restaurantId, item) => {
    const restaurant = restaurants.find(r=>r.id===restaurantId)
    if (!restaurant) return

    // if restaurant has a corpCode, use group balance
    if (restaurant.corpCode) {
      const gKey = `pointsGroup_${restaurant.corpCode}`
      const groupBal = parseInt(localStorage.getItem(gKey) || '0')
      if (groupBal < restaurant.pointsRate) return // not enough group points
      localStorage.setItem(gKey, String(Math.max(0, groupBal - restaurant.pointsRate)))
    } else {
      const mapKey = `pointsMap_${restaurantId}`
      const cur = parseInt(localStorage.getItem(mapKey) || restaurant.demoCustomerPoints)
      if (cur < restaurant.pointsRate) return
      localStorage.setItem(mapKey, String(Math.max(0, cur - restaurant.pointsRate)))
    }

    // add the redeemed item into the cart with price 0 and a redeemed flag
    setCart(prev => {
      const freeItem = {
        id: `redeem_${item.id}_${Date.now()}`,
        name: item.name,
        price: 0,
        qty: 1,
        restaurantId: restaurantId,
        redeemed: true
      }
      return [...prev, freeItem]
    })
  }

  const clearCart = () => setCart([])

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Restaurants</h2>
        <RestaurantList restaurants={restaurants} selected={selected} onSelect={setSelected} />
        <div className="dinein">
          <h3>Dine-in</h3>
          <input placeholder="Enter table code" value={dineInCode} onChange={e=>setDineInCode(e.target.value)} />
          <small>Enter the code shown at your table to link order</small>
        </div>
      </aside>

      <main className="main">
        <header className="restaurant-header">
          <div>
            <h1>{selected.name}</h1>
            <p className="muted">{selected.description}</p>
          </div>
          <div className="points">
            <small>Points Balance</small>
            <div className="points-balance"><strong>{parseInt(localStorage.getItem(`pointsMap_${selected.id}`) || selected.demoCustomerPoints)}</strong></div>
          </div>
        </header>

  <Menu categories={selected.categories} onAdd={addToCart} selectedRestaurant={selected} onRedeem={redeemPointsForFreeItem} />
      </main>

      <aside className="cart">
        <Cart
          cart={cart.filter(i=>i.restaurantId===selected.id)}
          onClear={clearCart}
          restaurant={selected}
          onRedeem={redeemPointsForFreeItem}
          dineInCode={dineInCode}
          validDineIn={selected.tableCodes.includes(dineInCode)}
        />
      </aside>
    </div>
  )
}
