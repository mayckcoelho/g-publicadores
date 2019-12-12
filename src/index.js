import React from 'react'

import * as serviceWorker from './serviceWorker'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import multi from 'redux-multi'
import thunk from 'redux-thunk'

import App from './containers/_app/App'
import reducers from './containers/_app/reducers'

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = applyMiddleware(multi, thunk)(createStore)(reducers, devTools)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister();
