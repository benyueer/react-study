import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function ReactReduxHookPage() {
  const count = useSelector((state: any) => state.count)
  const dispatch = useDispatch()
  const add = useCallback(() => dispatch({ type: 'ADD' }), [])
  return (
    <div>
      <div>ReactReduxHookPage</div>
      <div>{count}</div>
      <button onClick={add}>add</button>
    </div>
  )

}
