import React, { Component } from "react";
import HomePage from "./HomePage";
import { ThemeProvider, UserProvider } from "../Context";
import ConsumerPage from "./ConsumerPage";
import UseContextPage from "./UseContextPage";


export default class ContextPage extends Component<{}, any> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: any) {
    super(props)
    this.state = {
      theme: {
        themeColor: 'red'
      },
      user: { name: 'zs' }
    }
  }
  render() {
    const { theme, user } = this.state
    return (
      <div>
        contextpage
        <ThemeProvider value={theme}>
          {/* <HomePage></HomePage> */}
          <UserProvider value={user}>
            {/* <ConsumerPage></ConsumerPage> */}
            <UseContextPage></UseContextPage>
          </UserProvider>
        </ThemeProvider>
      </div>
    )
  }
}