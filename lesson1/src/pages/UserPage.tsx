import React, { useContext } from 'react'
import { ThemeContext } from '../Context'

export default function UserPage() {
  const ctx: any = useContext(ThemeContext)
  return (
    <div className={ctx?.themeColor}>UserPage</div>
  )
}
