import React, { Component } from 'react'

class FCmp extends Component {
  render() {
    return (
      <div>123</div>
    )
  }
}

export default class ClassComp extends FCmp {
  state = {
    count: 0
  }

  componentDidMount(): void {

      console.log(super.render())

      document.querySelector('#count')?.addEventListener('click', () => {
        debugger
        this.setState({
          count: this.state.count + 1
        })
        console.log(this.state)
      })
  }

  render() {
    return (
      <div>
        <p>ClassComp</p>
        <span onClick={() => {
          debugger
          this.setState({
            count: this.state.count + 1
          })
          console.log(this.state)
        }}>{this.state.count}</span>
        <span id="count">{this.state.count}</span>
      </div>
    )
  }
}
