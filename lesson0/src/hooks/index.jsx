import React, { useMemo, Suspense, memo } from 'react'
import { Link, Route } from 'react-router-dom'
import { routes } from '../router'
import styles from './styles.module.scss'

const resolveRouters = () => {
  return routes.filter(route => route.path === '/hooks')[0].children
}

const renderRouteList = () => {
  return resolveRouters().map(route => (
    <Route
      key={route.path}
      path={route.path}
      component={route.component}
    ></Route>
  ))
}

const renderLinkList = () => {
  return resolveRouters().map(route => (
    <Link
      to={route.path}
      key={route.path}
      className={styles.menuItem}
    >{route.mate.title}</Link>
  ))
}


function HooksView(props) {
  const routeList = useMemo(() => renderRouteList(), [])
  const linkList = useMemo(() => renderLinkList(), [])

  console.log(props)
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <div>HooksView</div>
        {linkList}
        {routeList}
      </Suspense>
    </>
  )
}

export default memo(HooksView)
