import React, { useState, useReducer, createContext, useEffect } from 'react';
import './App.css';
import 'react-rangeslider/lib/index.css';
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
  currentJam: {}
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
    case Actions.NEW_JAM:
      let newJam = action.payload;
      axios.post('http://127.0.0.1:8000/api/', {
            username: newJam.username,
            title: newJam.title,
            description: newJam.description,
            tempo: newJam.tempo,
            notes: newJam.notes,
            bassDrumNotes: newJam.bassDrumNotes,
            cymbalNotes: newJam.cymbalNotes,
            snareNotes: newJam.snareNotes,
      })
      .then(resp => {
        console.log(resp)
        return {
          ...state,
          data: [...state.data, resp]
        }
      })

      return state;

    case Actions.OPEN_JAM:
      return {
        ...state,
        jamIndex: action.payload
      }
    case Actions.NEW_JAM:
      return state;
    case Actions.CURRENT_JAM:
      return {
        ...state,
        currentJam: action.payload
      }
      // return{

      // }
      // return {
      //   loading: false,
      //   error: '',
      //   data: state.data.map((jam, i) => {
      //       return i ===  action.i ?  console.log(jam) : null
      //   })
      // }
      // return state;
    // case "reset":
    //   return initialState;
    default:
      return state;
  }
}

// const addNewJam = (state, newJam) => {
//   console.log(newJam);
//   axios
//     .post('http://127.0.0.1:8000/api/', {
//           username: newJam.username,
//           title: newJam.title,
//           description: newJam.description,
//           tempo: newJam.tempo,
//           notes: newJam.notes,
//           bassDrumNotes: newJam.bassDrumNotes,
//           cymbalNotes: newJam.cymbalNotes,
//           snareNotes: newJam.snareNotes,
//     })
//     .then(resp => {
//       console.log(resp)

//     })
// }

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/')
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
