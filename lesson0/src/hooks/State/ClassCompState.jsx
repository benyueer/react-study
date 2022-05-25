import React, { Component } from 'react'
import styles from '../styles.module.scss'

/**
 * setState的同步异步
 * 1. 合成事件中
 * 2. 原生事件中
 * 3. 生命周期函数中
 * 4. setTimeout中
 * 5. 批量更新
 */

export default class ClassCompState extends Component {
  state = {
    count: 0,
    number: 0
  }

  addHandler = () => {
    this.setState({
      count: this.state.count + 1
    })
    console.log(this.state.count) // 输出更新前的值
  }

  componentDidMount() {
    const addBtn = document.querySelector('#addBtn')
    addBtn.addEventListener('click', () => {
      this.setState({
        count: this.state.count + 1
      })
      this.setState({
        count: this.state.count + 1
      })
      this.setState({
        count: this.state.count + 1
      })
      console.log(this.state.count)
    })

    this.setState({
      count: this.state.count + 1
    })
    console.log(this.state.count) // 输出更新前的值

    setTimeout(() => {
      this.setState({
        count: this.state.count + 1
      })
      console.log(this.state.count)
    })
  }

  handerClick = () => {
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
    }, 1000)
    Promise.resolve().then(() => {
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
    })
  };

  render() {
    return (
      <div className={styles.border}>
        <div>ClassCompState</div>
        <div>count: {this.state.count}</div>
        <button onClick={this.addHandler}>合成事件</button>
        <button id="addBtn">原生事件</button>
        <button onClick={this.handerClick}>num++</button>
      </div>
    )
  }
}
