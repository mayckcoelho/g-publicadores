import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from '../../shared/commons/PrivateRoute'

import Layout from '../_layout'
import { MainLayout } from '../_layout/styles'
import Login from '../login'
import Home from '../home'

import Grupos from '../grupos'
import Publicadores from '../publicadores'
import Registros from '../registros'
import Usuarios from '../usuarios'

const Pages = () => (
    <Switch>
        <Route exact path="/grupos" component={Grupos} />
        <Route exact path="/publicadores" component={Publicadores} />
        <Route exact path="/registros" component={Registros} />
        <Route exact path="/usuarios" component={Usuarios} />
    </Switch>
)

const wrappedRoutes = () => (
    <MainLayout>
        <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/" component={Pages} />
        </Layout>
    </MainLayout>
)

const Routes = () => (
    <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/" component={wrappedRoutes} />
        <Redirect from="*" to="/" />
    </Switch>
)

export default Routes