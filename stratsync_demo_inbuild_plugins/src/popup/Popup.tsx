import React from 'react'

export default function Popup() {
  const [count, setCount] = React.useState(0)

  return (
    <div style={{ width: 350, padding: 16 }}>
      <h3>My Extension Popup</h3>
      <p>Clicks: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}
