// import React, {Component, useState } from 'react'
import Component from './kreact/Component'
import ReactDOM, { useState } from './kreact/react-dom'
// import ReactDOM from 'react-dom';


function FunctionComponent(props) {
  const [state, setState] = useState(0)
  const click = () => {
    setState(state + 1)
    console.log('click', state)
  }
  return <div>
    <p>{props.name}</p>
    <button onClick={click}>{state + ''}</button>
  </div>
}

class ClassComponent extends Component {
  render() {
    return <div>{this.props.name}</div>
  }
}

const jsx = (
  <div>
    <span>hello</span>
    <p className='title'>title</p>
    <div>
      <span onClick={() => console.log('click')}>world</span>
    </div>
    <FunctionComponent name='funComp' />
    <ClassComponent name="classComp" />
    {/* <>
      <div>Fragment</div>
      <div>div</div>
    </> */}
  </div>
)
ReactDOM.render(jsx, document.getElementById('root'))