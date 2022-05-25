import React, { useEffect } from 'react'
import styles from '../styles.module.scss'

export default function FunCompState() {
  const [count, setCount] = React.useState(0)

  const addHandler = () => {
    setCount(preCount => preCount + 1)
    setCount(preCount => preCount + 1)
    setCount(preCount => preCount + 1)
    console.log(count)
  }

  useEffect(() => {
    const addBtn = document.querySelector('#addBtn')
    const handler = () => {
      setCount(preCount => preCount + 1)
      setCount(preCount => preCount + 1)
      setCount(preCount => preCount + 1)
      console.log(count)
    }
    addBtn.addEventListener('click', handler)

    setCount(count + 1)
    console.log(count)

    setTimeout(() => {
      setCount(count + 1)
      console.log(count)
    })
    return addBtn.removeEventListener('click', handler)
  }, [])

  return (
    <div className={styles.border}>
      <div>FunCompState</div>
      <div>{count}</div>
      <button onClick={addHandler}>合成事件</button>
      <button id="addBtn" onClick={addHandler}>原生事件</button>
    </div>
  )
}
