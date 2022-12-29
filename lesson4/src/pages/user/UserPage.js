import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import UserAdd from './UserAdd'

export default class UserPage extends Component {
  render() {
    return (
      <div>
        <p>user</p>
        <Link to="/user/add">add</Link>

        <Route
          path="/user/add"
          component={UserAdd}
          exact
        ></Route>
      </div>
    )
  }
}
