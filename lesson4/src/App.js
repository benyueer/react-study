
// import { BrowserRouter as Router, Route, Link, Switch, useRouteMatch, withRouter } from 'react-router-dom'
import { BroeserRouter as Router, Route, Link, Switch, useRouteMatch } from './ReactRouterDom'
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

        <Switch>
          <Route 
            exact 
            path="/" 
            children={() => <div>ccc</div>}
            render={() => <div>rander</div>}
            component={HomePage} 
          />
          <Route path="/user" component={UserPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/product/:id" render={() => <Product />} />
          <Route component={_404} />
        </Switch>

      </Router>
    </div>
  )
}

function Product() {
  const {url, params} = useRouteMatch()

  return (
    <div>
      product {params.id}
      <Link to={url + "/detail"}>detail</Link>
      <Route path={url + '/detail'} render={() => <Detail />} />
    </div>
  )
}

function Detail() {
  return (
    <div>
      detail
    </div>
  )
}

export default App
