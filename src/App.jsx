import React, { useState, useEffect } from 'react'
import RestaurantList from './components/RestaurantList'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Home from './views/Home'
import RestaurantDetail from './views/RestaurantDetail'
import Giftcards from './views/Giftcards'
import Orders from './views/Orders'
import Account from './views/Account'
import sampleData from './data/sample'

export default function App() {
  const [restaurants] = useState(sampleData)
  const [selected, setSelected] = useState(null)
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')||'[]'))
  // per-restaurant dine-in codes are handled below
  const [view, setView] = useState('home') // 'home' | 'detail' | 'ordering'
  const [orderingMode, setOrderingMode] = useState(null) // 'dinein' | 'takeout'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  

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
    // only allow addToCart when a restaurant is selected (ordering view)
    if (!selected) return
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

  const handleSelectRestaurant = (r) => {
    setSelected(r)
    setView('detail')
  }

  const handleNavigate = (target) => {
    // clear selection when navigating to top-level pages
    setSelected(null)
    setView(target)
  }

  const handleStartOrdering = (mode) => {
    setOrderingMode(mode)
    setView('ordering')
  }

  // per-restaurant dine-in code state (loaded when a restaurant is selected)
  const [currentDineInCode, setCurrentDineInCode] = useState('')
  const [orderingInputCode, setOrderingInputCode] = useState('')

  useEffect(() => {
    if (selected) {
      const key = `dineInCode_${selected.id}`
      setCurrentDineInCode(localStorage.getItem(key) || '')
    } else {
      setCurrentDineInCode('')
    }
    // sync ordering input when selected changes
    setOrderingInputCode('')
  }, [selected])

  const setDineInCodeForSelected = (code) => {
    if (!selected) return
    const key = `dineInCode_${selected.id}`
    localStorage.setItem(key, code)
    setCurrentDineInCode(code)
  }

  useEffect(()=>{
    // keep the ordering input synced to saved code when saved elsewhere
    setOrderingInputCode(currentDineInCode || '')
  }, [currentDineInCode])

  return (
    <div className="app" data-view={view}>
      {/* Top header with brand and mobile hamburger */}
      <header className="top-header">
        <div className="brand">Tabz</div>
        <nav className="top-nav">
          <button className="pill" onClick={()=>setView('home')}>Home</button>
          <button className="pill" onClick={()=>setView('orders')}>Orders</button>
          <button className="pill" onClick={()=>setView('account')}>Account</button>
        </nav>
        <button className="hamburger" onClick={()=>setMobileMenuOpen(true)} aria-label="Open menu">☰</button>
      </header>
      <aside className="sidebar">
        {/* Sidebar intentionally left empty — restaurant list removed per UX request */}
      </aside>

      <main className="main">
        <div className="inner">
          {view === 'home' && (
            <Home restaurants={restaurants} onSelect={handleSelectRestaurant} onNavigate={handleNavigate} />
          )}

          {view === 'giftcards' && (
            <Giftcards />
          )}

          {view === 'orders' && (
            <Orders />
          )}

          {view === 'account' && (
            <Account />
          )}

          {view === 'detail' && selected && (
            <RestaurantDetail restaurant={selected} onBack={()=>setView('home')} onStartOrdering={handleStartOrdering} setDineInCode={setDineInCodeForSelected} currentDineInCode={currentDineInCode} />
          )}

          {view === 'ordering' && selected && (
            <>
              <header className="restaurant-header">
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <button className="back" onClick={() => { setView('home'); setSelected(null); setOrderingMode(null); }}>&larr;</button>
                  <div>
                    <h1>{selected.name}</h1>
                    <p className="muted">{selected.description}</p>

                    <div style={{marginTop:8, display:'flex', gap:8, alignItems:'center'}}>
                      <button className={`pill ${orderingMode==='dinein' ? 'active':''}`} onClick={()=>setOrderingMode('dinein')}>Dine In</button>
                      <button className={`pill ${orderingMode==='takeout' ? 'active':''}`} onClick={()=>setOrderingMode('takeout')}>Takeout</button>
                      {orderingMode === 'dinein' && (
                        <div style={{marginLeft:12, display:'flex', gap:8, alignItems:'center'}}>
                          <input className="dinein-input" placeholder="Table code" value={orderingInputCode} onChange={e=>setOrderingInputCode(e.target.value)} />
                          <button className="save" onClick={()=>setDineInCodeForSelected(orderingInputCode)}>Save</button>
                          <div style={{marginLeft:8}}>{currentDineInCode ? (selected.tableCodes.includes(currentDineInCode) ? <span className="badge valid">Valid</span> : <span className="badge invalid">Invalid</span>) : <span className="muted">No code</span>}</div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
                <div className="points">
                  <small>Points Balance</small>
                  <div className="points-balance"><strong>{selected ? parseInt(localStorage.getItem(`pointsMap_${selected.id}`) || selected.demoCustomerPoints) : 0}</strong></div>
                </div>
              </header>

              <Menu categories={selected.categories} onAdd={addToCart} selectedRestaurant={selected} onRedeem={redeemPointsForFreeItem} onNavigate={handleNavigate} />
            </>
          )}
        </div>
      </main>

      <aside className="cart">
        {view === 'ordering' && selected && (
          <Cart
            cart={cart.filter(i=> selected ? i.restaurantId===selected.id : false)}
            onClear={clearCart}
            restaurant={selected}
            onRedeem={redeemPointsForFreeItem}
            dineInCode={currentDineInCode}
            validDineIn={selected ? selected.tableCodes.includes(currentDineInCode) : false}
            orderingMode={orderingMode}
            orderingInputCode={orderingInputCode}
          />
        )}
      </aside>

      {/* Floating cart button for mobile */}
      {view === 'ordering' && selected && (
        <button className="floating-cart-btn" onClick={()=>setView('cart')}>View Cart ({cart.filter(i=> selected ? i.restaurantId===selected.id : false).length})</button>
      )}

      {/* Render mobile cart overlay at root so fixed/fullscreen covers viewport */}
      {view === 'cart' && (
        <div className="mobile-cart-overlay">
          <div className="mobile-cart-header">
            <button className="back" onClick={()=>setView('ordering')}>&larr;</button>
            <h2>Cart</h2>
          </div>
          <div className="mobile-cart-body">
            <Cart
              cart={cart.filter(i=> selected ? i.restaurantId===selected.id : false)}
              onClear={clearCart}
              restaurant={selected}
              onRedeem={redeemPointsForFreeItem}
              dineInCode={currentDineInCode}
              validDineIn={selected ? selected.tableCodes.includes(currentDineInCode) : false}
              orderingMode={orderingMode}
              orderingInputCode={orderingInputCode}
            />
          </div>
        </div>
      )}

      {/* Mobile full-screen nav overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-inner">
            <button className="close" onClick={()=>setMobileMenuOpen(false)}>✕</button>
            <ul className="mobile-nav-list">
              <li onClick={()=>{setView('home'); setMobileMenuOpen(false)}}>Home</li>
              <li onClick={()=>{setView('orders'); setMobileMenuOpen(false)}}>Orders</li>
              <li onClick={()=>{setView('giftcards'); setMobileMenuOpen(false)}}>Giftcards</li>
              <li onClick={()=>{setView('account'); setMobileMenuOpen(false)}}>Account</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
