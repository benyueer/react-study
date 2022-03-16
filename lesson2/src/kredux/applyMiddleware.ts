export default function applyMiddleware(...middlewares: any[]) {
  return (createStore: Function) => (reducer: Function) => {
    const store = createStore(reducer)
    let dispatch = store.dispatch

    // TODO: dispatch加强

    const midApi = {
      getState: store.getState,
      dispatch: (action: any, ...args: any) => dispatch(action, args)
    }

    const middlewareChain = middlewares.map(middleware => middleware(midApi))

    dispatch = compose(...middlewareChain)(store.dispatch)

    console.log(dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return (arg: any) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)))
}