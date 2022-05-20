import React, { Component } from 'react'

/**
 * 挂载
 * constructor
 * componentWillMount (old) ---- getDerivedStateFromProps (new)
 * render
 * componentDidMount
 * 
 * 更新
 * componentWillReceiveProps (old) ---- getDerivedStateFromProps (new)
 * shouldComponentUpdate
 * componentWillUpdate (old)
 * render
 * getSnapshotBeforeUpdate (new)
 * componentDidUpdate
 * 
 * 卸载
 * componentWillUnmount
 * 
 * 
 * * React从v16.3开始废弃 componentWillMount componentWillReceiveProps componentWillUpdate 三个钩子函数
 * * 因为Fiber的引入导致渲染过程能够被中断，所以挂载和更新之前的生命周期钩子可能会被执行多次或不执行
 */

export default class LifeCycleView extends Component {
  constructor() {
    super()
    console.log('constructor')
    this.state = {
      data: 1,
      data2: 1,
      childMount: true
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    console.log('getDerivedStateFromProps', nextProps, state)
    return null
  }

  componentDidMount() {
    console.log('componentDidMount')
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate', prevProps, prevState)
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate')
    return true
  }

  add = () => {
    this.setState({
      data: Math.random()
    })
  }

  add2 = () => {
    this.setState({
      data2: Math.random()
    })
  }

  traggerChild = () => {
    this.setState({
      childMount: !this.state.childMount
    })
  }

  render() {
    return (
      <>
        <div>LifeCycleView</div>
        <button onClick={this.add}>btn1</button>
        <button onClick={this.add2}>btn2</button>
        <button onClick={this.traggerChild}>tragger child</button>
        {this.state.data}
        {
          this.state.childMount && <Child num={this.state.data2} />
        }
      </>
    )
  }
}

class Child extends Component {
  constructor(props) {
    super(props)
    console.log('constructor------child')
    this.state = {
      data: 1
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    console.log('getDerivedStateFromProps------child', nextProps, state)
    return null
  }

  componentDidMount() {
    console.log('componentDidMount------child')
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate------child', prevProps, prevState)
  }

  componentDidUpdate() {
    console.log('componentDidUpdate------child')
  }

  componentWillUnmount() {
    console.log('componentWillUnmount------child')
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate------child')
    return true
  }

  add = () => {
    this.setState({
      data: Math.random()
    })
  }

  render() {
    return (
      <>
        <div>child</div>
        <button onClick={this.add}>btn</button>
        {this.state.data}<br />
        {this.props.num}
      </>
    )
  }
}
