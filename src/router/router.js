import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import About from '../views/About'
import Home from '../views/home.jsx'
import Collections from '../views/Collections'
import NotFound from '../views/NotFound'

export default function()
{
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/collections" component={Collections} />
        <Route exact path="/users" name="home-users" component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}
