import React, { Component } from 'react'

export default class RenderPropsView extends Component {
  render() {
    return (
      <>
        <div>RenderPropsView</div>
        <Mouse render={(data) => <Cat {...data} />} />
      </>
    )
  }
}

class Mouse extends Component {
  state = {
    x: 0,
    y: 0
  }
  mouseMoveHandler = (e) => {
    this.setState({
      x: e.clientX,
      y: e.clientY
    })    
  }
  render() {
    return (
      <>
        <p>move</p>
        <div 
          style={{width: '100vw', height: '100vh', background: '#789'}}
          onMouseMove={this.mouseMoveHandler}
        >
          {
            this.props.render(this.state)
          }
          <span>x: {this.state.x}</span><br/>
          <span>y: {this.state.y}</span>
        </div>
      </>
    )
  }
}


class Cat extends Component {
  render() {
    return (
      <div style={{position: 'absolute', top: this.props.y, left: this.props.x}}>
        <span>🌸</span>
      </div>
    )
  }
}