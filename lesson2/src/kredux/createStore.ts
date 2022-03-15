interface IAction {
  type: string
  payload: any
}

export default function createStore(reducer: Function) {

  let currentState: any = null
  let currentListeners: Function[] = []

  function getState() {
    return currentState
  }

  function dispatch(action: IAction) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(listener => listener())
  }

  function subscribe(listener: Function) {
    currentListeners.push(listener)

    return () => {
      currentListeners = currentListeners.filter(_listener => _listener !== listener)
    }
  }

  dispatch({type: 'DEFAULT', payload: null})

  return {
    getState,
    dispatch,
    subscribe
  }
}