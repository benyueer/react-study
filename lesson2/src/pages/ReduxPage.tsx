import React from 'react'
import store from '../store'

export default class ReduxPage extends React.Component {
  increment = () => {
    store.dispatch({
      type: 'INCREMENT',
      payload: 1
    })
  }

  asyAdd = () => {
    // @ts-ignore
    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        dispatch({type: 'INCREMENT', payload: 1})
      }, 1000)
    })
  }

  unsubscribe: any

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <div>
        <div>ReduxPage</div>
        <div>{store.getState()}</div>
        <button onClick={this.increment}>add</button>
        <button onClick={this.asyAdd}>asyadd</button>
      </div>
    )
  }
}