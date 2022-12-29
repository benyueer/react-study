import React, { Component } from 'react'

export default class ClassComp extends Component {
  state = {
    count: 0
  }
  render() {
    return (
      <div>
        <p>ClassComp</p>
        <span onClick={() => {
          this.setState({
            count: this.state.count + 1
          })
        }}>{this.state.count}</span>
      </div>
    )
  }
}
