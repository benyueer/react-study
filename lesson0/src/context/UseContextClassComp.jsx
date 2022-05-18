import React, { Component } from 'react'
import { ThemeContext } from './context'

export default class UseContextClassComp extends Component {
  static contextType = ThemeContext
  render() {
    return (
      <>
        <div>UseContextClassComp</div>
        <button className={this.context}>btn-theme: {this.context}</button>
      </>
    )
  }
}
