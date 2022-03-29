import React, { useContext } from 'react'
import { RouterContext } from './RouterContext'

export default function Link({to, children, ...restProps}) {
  const {history} = useContext(RouterContext)
  const handelClick = e => {
    e.preventDefault()
    history.push(to)
  }
  return (
    <a href={to} {...restProps} onClick={handelClick}>
      {children}
    </a>
  )
}
