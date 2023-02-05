import {legacy_createStore as createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import detailReducer from './reducers';

const rootReducer = combineReducers({detailReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));