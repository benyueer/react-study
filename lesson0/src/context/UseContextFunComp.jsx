import React, {useContext, useEffect} from 'react'
import { ThemeContext } from './context'

export default function UseContextFunComp() {
  useEffect(() => {
    console.log('useEffect')
  })
  const theme = useContext(ThemeContext)
  return (
    <>
      <div>UseContextFunComp</div>
      <button className={theme}>btn-theme: {theme}</button>
    </>
  )
}
