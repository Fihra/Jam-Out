import React, { useState, useReducer, createContext, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu';
import Actions from './components/Actions';
import axios from 'axios';

export const JamContext = createContext(); 

const initialState = {
  loading: true,
  error: '',
  data: {}
};
const reducer = (state, action) => {
  console.log(action.payload)
  // console.log(Actions.FETCH_DATA);
  switch(action.type){
    case Actions.FETCH_DATA:
      return {
        loading: false,
        data: action.payload,
        error: ''
      }
    case Actions.FETCH_ERROR:
      return {
        loading: false,
        data: {},
        error: "Error ERROR!"
      }
    // case "reset":
    //   return initialState;
    default:
      return state;
  }
}



const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/')
      .then(resp => {
        dispatch({type: 'FETCH_DATA', payload: resp.data})
          
      })
      .catch(error => {
        dispatch({type: 'FETCH_ERROR'})
      })

  }, [])
  
  return (
    // <JamContext.Provider value={{dataState: data, dataDispatch: dispatch}}>
        <div className="App">
            <h1>Jam Out</h1>
              <div>
                {console.log(state)}
                {state.loading ? 'loading': state.data[0].username}
                {state.error ? state.error : null}
                
              </div>
            <Menu/>
        </div>
      // </JamContext.Provider>

  );
}

export default App;
