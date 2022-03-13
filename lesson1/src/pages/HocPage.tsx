import React from 'react'

const foo = (Cmp: any) => (props: any) => {
  return <div>
    <Cmp {...props}></Cmp>
  </div>
}

function Child(props: any) {
  return <div>Child-{props.name}</div>
}

const Foo = foo(Child)

export default function HocPage() {
  return (
    <div>
      <p>HocPage</p>
      <div><Foo name="name"></Foo></div>
    </div>
  )
}
