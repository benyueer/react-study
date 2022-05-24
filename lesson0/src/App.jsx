import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { routes } from './router'
import styles from './styles.module.less'


export default function App() {
  console.log(styles)
  return (
    <>
      <div>app</div>
      <BrowserRouter>
        {
          routes.map((route, index) => (
            <div className={styles.menuItem}>
              <Link
                to={route.path}
                key={route.path}
              >{route.mate.title}</Link>
            </div>
          ))
        }
        <Routes>
          {
            routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              >
              </Route>
            ))
          }
        </Routes>
      </BrowserRouter>
    </>
  )
}
