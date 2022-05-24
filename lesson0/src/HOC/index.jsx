import React, { Component } from 'react'

export default class HocView extends Component {
  state = {
    list: [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
      { name: 'c', age: 3 },
      { name: 'd', age: 4 },
      { name: 'e', age: 5 },
    ]
  }

  nameCRef = null
  setNameCRef = (el) => {
    this.nameCRef = el
  }

  render() {
    return (
      <>
        <div>HocView</div>
        <p>sample list</p>
        {
          this.state.list.map((item) => <ListItem {...item} key={item.name} />)
        }
        <p>border item</p>
        {
          this.state.list.map((item) => <BorderListItem {...item} key={item.name} />)
        }
        <p>borde card</p>
        {
          this.state.list.map((item) => <BorderCardListItem {...item} nameCRef={this.setNameCRef} key={item.name} />)
        }
        <button onClick={() => {console.log(this.nameCRef)}}>get name c</button>
      </>
    )
  }
}

function ListItem(props) {
  const { name, age } = props
  return (
    <>
      <div>{name} - {age}</div>
    </>
  )
}

const BorderListItem = withBorder(ListItem)

function withBorder(Comp) {
  return (props) => {
    return (
      <>
        <div style={{ border: '1px solid #123' }}>
          <Comp {...props} />
        </div>
      </>
    )
  }
}

const BorderCardListItem = setWidth(withBorder(withAdd(CardListItem)), 100)

function withAdd(Comp) {
  return (props) => {
    const {age, name} = props
    const [myAge, setMyAge] = React.useState(age)
    const addAgeHandler = () => {
      setMyAge(myAge * 2)
    }
    return (
      <>
        <div>add</div>
        <Comp {...props} age={myAge} />
        <button onClick={addAgeHandler}>add age</button>
      </>
    )
  }
}

function CardListItem(props) {
  const { name, age, nameCRef } = props

  const setRef = (el) => {
    if (name === 'c') {
      nameCRef(el)
    }
  }
  return (
    <>
      <div style={{ width: '100px', height: '100px' }} ref={setRef}>
        <div>{name} - {age}</div>
      </div>
    </>
  )
}

function setWidth(Comp, width) {
  return (props) => {
    return (
      <div style={{width}}>
        <Comp {...props} />
      </div>
    )
  }
}