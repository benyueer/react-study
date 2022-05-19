import React, { useEffect, useRef } from 'react'

export default function HookUseRef() {
  const inputRef = useRef(null)
  useEffect(() => {
    console.log('inputRef', inputRef.current) // 会执行两次是因为strictMode
    inputRef.current.value = 'useRef'
  }, [])
  return (
    <>
      <div>HookUseRef</div>
      <input ref={inputRef} type="text" />
    </>
  )
}
