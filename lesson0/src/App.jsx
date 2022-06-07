import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { routes } from './router'
import styles from './styles.module.scss'
console.log(styles)


export default function App() {
  return (
    <>
      <div>app</div>
      <Suspense fallback={<div>loading</div>}>
        <BrowserRouter>
          {
            routes.map((route, index) => (
              <div
                key={route.path}
                className={styles.menuItem}
              >
                <Link
                  to={route.path}
                >{route.mate.title}</Link>
              </div>
            ))
          }
          <Switch>
            {
              routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  component={route.component}
                >
                </Route>
              ))
            }
          </Switch>
        </BrowserRouter>
      </Suspense>
    </>
  )
}
