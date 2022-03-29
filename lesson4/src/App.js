/* eslint-disable react/jsx-pascal-case */
// import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { BroeserRouter as Router, Route, Link } from './ReactRouterDom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import _404 from './pages/_404'
import UserPage from './pages/UserPage'

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">首页</Link>
        <Link to="/user">用户</Link>
        <Link to="/login">登录</Link>
        <Link to="/product/123">商品</Link>

        {/* <Switch> */}
          <Route 
            exact 
            path="/" 
            children={() => <div>ccc</div>}
            render={() => <div>rander</div>}
            component={HomePage} 
          />
          <Route path="/user" component={UserPage} />
          <Route path="/login" component={LoginPage} />
          <Route component={_404} />
        {/* </Switch> */}

      </Router>
    </div>
  )
}

export default App
