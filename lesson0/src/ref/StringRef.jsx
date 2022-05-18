import React, { Component } from 'react'

export default class StringRef extends Component {
  showData = () => {
    this.refs.input1.value = 'hello'
    this.refs.input2.value = 'world'
  }
  render() {
    return (
      <>
        <div>StringRef</div>
        <input ref="input1" type="text" />
        <input ref="input2" type="text" />
        <button onClick={this.showData}>btn</button>
      </>
    )
  }
}
