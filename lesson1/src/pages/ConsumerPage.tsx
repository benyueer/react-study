import React from 'react'
import { ThemeConsumer, UserConsumer } from '../Context'

export default function ConsumerPage() {
  return (
    <div>
      <h3>ConsumerPage</h3>
      <ThemeConsumer>
        {
          (themeContext: any) => <div className={themeContext?.themeColor}>

            <UserConsumer>
              {
                (userContext: any) => <p>{userContext?.name}</p>
              }
            </UserConsumer>
          </div>

        }
      </ThemeConsumer>
    </div>
  )
}
