import React, { useState, useReducer, createContext, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu';
import Actions from './components/Actions';
import axios from 'axios';
import Composition from './components/Composition';
import Keyboard from './components/Keyboard';

import Drawer from "@kiwicom/orbit-components/lib/Drawer";
import Button from '@kiwicom/orbit-components/lib/Button';

import MenuHamburger from "@kiwicom/orbit-components/lib/icons/MenuHamburger";
import PlusCircle from "@kiwicom/orbit-components/lib/icons/PlusCircle";
import Document from "@kiwicom/orbit-components/lib/icons/Document"
import Check from "@kiwicom/orbit-components/lib/icons/Check"
import MusicalInstruments from "@kiwicom/orbit-components/lib/icons/MusicalInstruments"

export const JamContext = createContext(); 

const initialState = {
  loading: true,
  error: '',
  data: {},
  jamIndex: 0,
};
const reducer = (state, action) => {
  switch(action.type){
    case Actions.FETCH_DATA:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: ''
      }
    case Actions.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        data: {},
        error: "Error ERROR!"
      }
    case Actions.OPEN_JAM:
      return {
        ...state,
        jamIndex: action.payload
      }
    case Actions.UPDATE_JAM:
      // console.log(action.payload);
      // return {
      //   loading: false,
      //   error: '',
      //   data: state.data.map((jam, i) => {
      //       return i ===  action.i ?  console.log(jam) : null
      //   })
      // }
      return state;
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
    <JamContext.Provider value={{dataState: state, dataDispatch: dispatch}}>
        <div className="App">
            <h1>Jam Out</h1>
            <Menu/>
            <Composition/>
            <Keyboard/>
        </div>
      </JamContext.Provider>

  );
}

export default App;
