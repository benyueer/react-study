import React, { useEffect, useImperativeHandle, useRef } from 'react'

export default function ForwardRef() {
  const caRef = useRef(null)
  const cbRef = useRef(null)
  const clickA = () => {
    caRef.current.value = 'A click'
  }

  const clickB = () => {
    cbRef.current.setCount(Math.random())
  }

  return (
    <>
      <div>ForwardRef</div>
      <button onClick={clickA}>A</button>
      <ChildA ref={caRef} />
      <button onClick={clickB}>B</button>
      <ChildB ref={cbRef} />
    </>
  )
}

const ChildA = React.forwardRef((props, ref) => {
  return <>
    <div>child</div>
    <input ref={ref} type="text" />
  </>
})


const ChildB = React.forwardRef((props, ref) => {
  const [count, setCount] = React.useState(0)
  useImperativeHandle(ref, () => ({
    setCount
  }))
  return <>
    {count}
  </>
})