// import {createStore, applyMiddleware} from 'redux'
import {createStore, applyMiddleware} from '../kredux/index'

import trunk from 'redux-thunk'
// import logger from 'redux-logger'

interface IAction {
  type: string
  payload: any
}

interface IMidProps {
  getState: Function,
  dispatch: Function
}

export const conterReducer = (state = 0, {type, payload}:IAction) => {
  switch (type) {
    case 'INCREMENT':
      return state + payload
    case 'DECREMENT':
      return state - payload
    default:
      return state
  }

}


const store = createStore(conterReducer, applyMiddleware(trunk, logger))


export default store


function logger({getState, dispatch}: IMidProps) {
  return (next: Function) => (action :any) => {
    console.log('next', next)
    console.log('action', action)
    console.log('***********************')
    let preState = getState()
    console.log('preState', preState)
    const returnValue = next(action)
    console.log('returnValue', returnValue)
    const nextState = getState()
    console.log('nextState', nextState)
    console.log('******************')
    return returnValue
  }
}


function trunk1({getState, dispatch}: IMidProps) {
  return (next: Function) => (action: any) => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }
    next(action)
  }
}

