import React from 'react';
import Component from './kreact/Component'
import ReactDOM from './kreact/react-dom';
// import ReactDOM from 'react-dom';


function FunctionComponent (props) {
  return <div>{props.name}</div>
}

class ClassComponent extends Component {
  render() {
    return <div>this is classComp, props: {this.props.name}</div>
  }
}

const jsx = (
  // <div>
  //   <span>hello</span>
  //   <p className='title'>title</p>
  //   <div>
  //     <span>world</span>
  //   </div>
    <FunctionComponent name='funComp' />
  //   <ClassComponent name="classComp" />
  // </div>
)
ReactDOM.render(jsx, document.getElementById('root'));