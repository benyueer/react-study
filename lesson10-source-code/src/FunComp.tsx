import React, { useState } from 'react'

export default function FunComp() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>FunComp</p>
      <span onClick={() => setCount(count+1)}>{count}</span>
    </div>
  )
}
