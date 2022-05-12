import React, { Component } from 'react'
import { matchPath } from 'react-router-dom'
import { RouterContext } from './RouterContext'

export default class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {
          context => {
            const location = this.props.location || context.location
            let match
            let element

            React.Children.forEach(this.props.children, child => {
              if (match == null && React.isValidElement(child)) {
                element = child
                match = child.props.path ? matchPath(location.pathname, child.props) : context.match
              }
            })

            return match ? React.cloneElement(element, {computedMatch: match}) : null
          }
        }
      </RouterContext.Consumer>
    )
  }
}
