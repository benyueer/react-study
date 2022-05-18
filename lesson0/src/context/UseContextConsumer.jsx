import React from 'react'
import {ThemeContext} from './context'

export default function UseContextConsumer() {
  return (
    <>
      <div>UseContextConsumer</div>
      <ThemeContext.Consumer>
        {
          theme => {
            return <div>{theme}</div>
          }
        }
      </ThemeContext.Consumer>
    </>
  )
}
