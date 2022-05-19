import React, { Component } from 'react'

export default class CreateRef extends Component {
  inputRef = React.createRef()
  childRef = React.createRef()
  componentDidMount() {
    setTimeout(() => {
      this.inputRef.current.value = 'world'
    }, 2000)
  }
  setVal = () => {
    console.log(this.childRef.current)
    this.childRef.current.setInputValue(this.inputRef.current.value)
  }
  render() {
    return (
      <>
        <div>CreateRef</div>
        <input ref={this.inputRef} type="text" />
        <button onClick={this.setVal}>setVal</button>
        <Child ref={this.childRef} />
      </>
    )
  }
}

class Child extends Component {
  inputRef = React.createRef()

  setInputValue = (val) => {
    this.inputRef.current.value = val
  }
  render() {
    return <>
      <div>child</div>
      <input ref={this.inputRef} type="text" />
    </>
  }
}
