import React, { useContext } from 'react'
import { ThemeContext, UserContxt } from '../Context'

export default function UseContextPage() {
  const {themeColor} = useContext(ThemeContext)
  const {name} = useContext(UserContxt)
  return (
    <div>UseContextPage
      <div className={themeColor}>{name}</div>
    </div>
  )
}
