import {createStore, applyMiddleware} from 'redux'
// import {createStore} from '../kredux/index'

import trunk from 'redux-thunk'
import logger from 'redux-logger'

interface IAction {
  type: string
  payload: any
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