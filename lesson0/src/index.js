import React from 'react'
import ReactDOM from 'react-dom/client'
import ContextView from './context'
import LifeCycleView from './lifeCycle'
import RefView from './ref'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <>
    {/* <ContextView /> */}
    {/* <RefView /> */}
    <LifeCycleView />
  </>
)


