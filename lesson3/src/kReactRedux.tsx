import React, { useCallback, useContext, useEffect, useLayoutEffect, useReducer, useState } from "react";

// 通过context传递数据
const Context = React.createContext({});

export function Provider({ store, children }: any) {
  return <Context.Provider value={store}>
    {children}
  </Context.Provider>
}

export const connect = (mapStateToProps: Function = (state: any) => state, mapDispatchToProps: Function | Object = (dispatch: Function) => dispatch) => (WarppedComponent: any) => (props: any) => {
  const store = React.useContext(Context);
  // @ts-ignore
  const { getState, dispatch, subscribe } = store;
  const stateProps = mapStateToProps(getState());
  let dispatchProps = { dispatch };
  if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch);
  } else if (typeof mapDispatchToProps === 'object') {
    dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
  }

  // 让函数组件强制更新
  // const [, forceUpdate] = useReducer((x: any) => x + 1, 0);
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    // @ts-ignore
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return () => {
      unsubscribe();
    }
  }, [forceUpdate, store])

  return <WarppedComponent {...props} {...stateProps} {...dispatchProps}></WarppedComponent>
}

// hook只能用在函数组件中，或自定义hook
function useForceUpdate() {
  const [state, setState] = useState(0)
  return useCallback(() => setState(prev => prev + 1), [])
}


function bindActionCreator(creator: Function, dispatch: Function) {
  return (...args: any) => dispatch(creator(...args))
}
export function bindActionCreators(creators: any, dispatch: Function) {
  let obj: any = {}
  for (let key in creators) {
    obj[key] = bindActionCreator(creators[key], dispatch)
  }
  return obj
}

export function useSelector(selector: Function) {

  const store = useStore()
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    // @ts-ignore
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return () => {
      unsubscribe();
    }
  }, [forceUpdate, store])

  // @ts-ignore
  const { getState } = store
  const selectorState = selector(getState())

  return selectorState
}

export function useStore() {
  const store = useContext(Context)
  return store
}

export function useDispatch() {
  const store = useStore()

  // @ts-ignore
  return store.dispatch
}