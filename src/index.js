import React from 'react';
import ReactDOM from 'react-dom';
import '../src/css/index.css';
import App from './App';
import { Provider } from 'react-redux'
import dataReducer from './reducers/dataReducer';
import { createStore,applyMiddleware  } from 'redux';
import reportWebVitals from './reportWebVitals';
import thunk from "redux-thunk" 
        
const store = createStore(dataReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
