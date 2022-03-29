import React, { Component } from 'react'
import { RouterContext } from './RouterContext'

export default class Router extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: props.history.location
    }
  }
  componentDidMount() {
    this.unsubscribe = this.props.history.listen(location => {
      this.setState({location})
    })
  }
  componentWillUnmount() {
    console.log('unmount')
    this.unsubscribe?.()
  }
  render() {
    return (
      <RouterContext.Provider value={{history: this.props.history, location: this.state.location}}>
        {this.props.children}
      </RouterContext.Provider>
    )
  }
}
