import React, { useRef, useCallback } from 'react'
import styles from '../styles.module.scss'

/**
 * useRef
 * 
 */


function useCacheFn(val) {
  const ref = useRef()
  setTimeout(() => {
    console.log('in cache', val, ref.current)
    ref.current = val
  })
  return ref.current
}


export default function RefView() {
  const [count, setCount] = React.useState(0)

  const addHandler = useCallback(() => {
    setCount(preCount => preCount + 1)
  }, [])

  const cacheFn = useCacheFn(addHandler)

  console.log(cacheFn === addHandler)

  return (
    <div className={styles.border}>
      <div>RefView</div>
      <button onClick={addHandler}>{count}</button>
    </div>
  )
}
