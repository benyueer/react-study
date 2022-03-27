import React, { Component } from 'react'
// import { connect } from 'react-redux'
import { connect } from '../kReactRedux'
// import { bindActionCreators } from 'redux'
import { bindActionCreators } from '../kReactRedux'

// @ts-ignore
@connect(
  // mapStateToProps 把state映射到props
  (state: any) => ( { count: state.count } ),
  // mapDispatchToProps  把dispatch映射到props
  (dispatch: any) => {
    // const add = () => dispatch({ type: 'ADD' })
    // const minus = () => dispatch({ type: 'MINUS' })
    // return {dispatch, add, minus}
    let creators = {
      add: () => ({ type: 'ADD' }),
      minus: () => ({ type: 'MINUS' })
    }
    creators = bindActionCreators(creators, dispatch)
    return { dispatch, ...creators }
  }
  // {
  //   add: () => ({ type: 'ADD' }),
  // }
)
export default class ReactReduxPage extends Component<any> {

  render() {
    console.log(this.props)
    const {count, add, minus, dispatch} = this.props
    return (
      <div>
        <div>ReactReduxPage</div>
        <div>{count}</div>
        <button onClick={add}>add</button>
        <button onClick={minus}>minus</button>
        <button onClick={() => dispatch({type: 'ADD'})}>dis</button>
      </div>
    )
  }
}
