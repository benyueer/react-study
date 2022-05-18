import React, {useContext} from 'react'
import { ThemeContext } from './context'

export default function UseContextFunComp() {
  const theme = useContext(ThemeContext)
  return (
    <>
      <div>UseContextFunComp</div>
      <button className={theme}>btn-theme: {theme}</button>
    </>
  )
}
