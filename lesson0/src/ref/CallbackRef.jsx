import React, { Component } from 'react'

export default class CallbackRef extends Component {
  boxRef = null
  inputRef = null
  setBoxRef = (el) => {
    this.boxRef = el
  }
  setInputRef = (el) => {
    this.inputRef = el
  }
  componentDidMount() {
    setTimeout(() => {
      this.boxRef.style.backgroundColor = '#789'
      this.inputRef.value = 'hello'
    }, 2000)
  }
  render() {
    return (
      <>
        <div>CalbackRef</div>
        <div ref={this.setBoxRef} className='callback-ref-box'></div>
        <Child inputRef={this.setInputRef}></Child>
      </>
    )
  }
}

class Child extends Component {
  render() {
    return <>
      <div>child</div>
      <input ref={this.props.inputRef} type="text" />
    </>
  }

}
