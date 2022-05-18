import React, { useState } from 'react'
import { ThemeContext } from './context'
import UseContextClassComp from './UseContextClassComp'
import UseContextConsumer from './UseContextConsumer'
import UseContextFunComp from './UseContextFunComp'

export default function ContextPage() {
  const [theme, setTheme] = useState('dark')

  const changeTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <div>ContextPage</div>
      <button onClick={changeTheme}>change theme</button>      
      <ThemeContext.Provider value={theme}>
        <UseContextClassComp />
        <UseContextFunComp />
        <UseContextConsumer />
      </ThemeContext.Provider>
    </>
  )
}
