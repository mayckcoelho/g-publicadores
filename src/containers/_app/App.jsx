import React from 'react'

import { hot } from 'react-hot-loader'
import { HashRouter } from 'react-router-dom'
import Routes from './Routes'

const App = () => (
    <HashRouter>
        <Routes />
    </HashRouter>
)

export default hot(module)(App)
