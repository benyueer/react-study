// import React, {Component, useState } from 'react'
import Component from './kreact/Component'
import ReactDOM, { useState } from './kreact/react-dom'
// import ReactDOM from 'react-dom';


function FunctionComponent(props) {
  const [state, setState] = useState(0)
  console.log(state)
  const logState = () => {
    console.log(state)
  }
  logState()
  const click = () => {
    setState(state + 1)
    console.log('click', state)
  }
  return <div>
    <p>{props.name}</p>
    <button onClick={click}>{state + ''}</button>
    {
      state % 2 === 0 ? <span>odd</span> : <span>even</span>
    }
  </div>
}

class ClassComponent extends Component {
  render() {
    return <div>{this.props.name}</div>
  }
}

const jsx = (
  // <div>
  //   <span>hello</span>
  //   <p className='title'>title</p>
  //   <div>
  //     <span onClick={() => console.log('click')}>world</span>
  //   </div>
  //   <FunctionComponent name='funComp' />
  //   <ClassComponent name="classComp" />
  //   <>
  //     <div>Fragment</div>
  //     <div>div</div>
  //   </>
  // </div>
  <FunctionComponent name='funComp' />
)
ReactDOM.render(jsx, document.getElementById('root'))