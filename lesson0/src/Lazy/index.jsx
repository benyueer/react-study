import React, { Suspense, lazy, startTransition } from 'react'

export default function LazyView() {
  const [tab, setTab] = React.useState('A')

  const handleTabChange = (tab) => {
    startTransition(() =>
      setTab(tab)
    )
  }

  return (
    <>
      <div>LazyView</div>
      <Tabs onTabChange={handleTabChange} />
      <Suspense fallback={<div>Loading...</div>}>
        {tab === 'A' ? <CompALazy /> : <CompBLazy />}
      </Suspense>
    </>
  )
}

const CompALazy = lazy(() => import('./CompA'))
const CompBLazy = lazy(() => import('./CompB'))

function Tabs(props) {
  return (
    <>
      <div>Tabs</div>
      <span onClick={() => props.onTabChange('A')}>A</span>
      <span onClick={() => props.onTabChange('B')}>B</span>
    </>
  )
}



