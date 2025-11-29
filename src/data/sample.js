const sample = [
  {
    id: 'r1',
    name: 'Sakura Teriyaki',
    description: 'Modern Japanese favorites',
    demoCustomerPoints: 120,
    pointsRate: 100, // points required per free item or similar demo
    corpCode: 'C100',
    tableCodes: ['T1', 'T2', 'T3'],
    categories: [
      {
        id: 'c1',
        name: 'Teriyaki',
        items: [
          { id: 'i1', name: 'Chicken Teriyaki', price: 10.99 },
          { id: 'i2', name: 'Salmon Teriyaki', price: 14.99 }
        ]
      },
      {
        id: 'c2',
        name: 'Appetizers',
        items: [
          { id: 'i3', name: 'Edamame', price: 3.5 },
          { id: 'i4', name: 'Gyoza', price: 5.0 }
        ]
      }
    ]
  },
  {
    id: 'r2',
    name: 'Green Bowl',
    description: 'Healthy bowls and salads',
    demoCustomerPoints: 40,
    pointsRate: 80,
    corpCode: 'C200',
    tableCodes: ['B1','B2'],
    categories: [
      {
        id: 'c3',
        name: 'Bowls',
        items: [
          { id: 'i5', name: 'Tofu Bowl', price: 9.5 },
          { id: 'i6', name: 'Chicken Bowl', price: 11.0 }
        ]
      }
    ]
  }
]

export default sample
