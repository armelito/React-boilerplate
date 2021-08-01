import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import reducers from '../reducers/reducers'

const initialState = {}

const middlewares = [thunk]

export default createStore(reducers, initialState, applyMiddleware(...middlewares))
