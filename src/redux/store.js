import { createStore, applyMiddleware } from 'redux';

import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

// For asynchronous API requests; 
// middleware allows you to write action creators that return a function instead of an action
// used to delay the dispatch of an action, or to dispatch only if a certain condition is met.
import thunk from 'redux-thunk';

// Used a basic tool for debugging and logging the state
import logger from 'redux-logger';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, logger))
);

export default store;