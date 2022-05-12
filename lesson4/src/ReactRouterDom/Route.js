import React, { Component } from 'react'
import { matchPath } from 'react-router-dom'
import { RouterContext } from './RouterContext'

export default class Route extends Component {
  render() {
    return <RouterContext.Consumer>
      {
        context => {
          const { location } = context
          console.log(location)
          const { path, component, children, render, computedMatch } = this.props
          const match = computedMatch ? computedMatch : path ? matchPath(location.pathname, this.props) : context.match
          const props = {
            ...context,
            match
          }
          return <RouterContext.Provider value={props}>
            {
              match
                ? children
                  ? typeof children === 'function'
                    ? children(props)
                    : children
                  : component
                    ? React.createElement(component, props)
                    : render
                      ? render(props)
                      : null
                : null
            }
          </RouterContext.Provider>
        }
      }
    </RouterContext.Consumer>
  }
}
