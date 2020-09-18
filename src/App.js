import React, { useState, useReducer, createContext, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu';
import Actions from './components/Actions';
import axios from 'axios';
import Composition from './components/Composition';
import Keyboard from './components/Keyboard';

import Drawer from "@kiwicom/orbit-components/lib/Drawer";
import Button from '@kiwicom/orbit-components/lib/Button';

const menuButtons = ["New", "Open", "Save"];

export const JamContext = createContext(); 

const initialState = {
  loading: true,
  error: '',
  data: {}
};
const reducer = (state, action) => {
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
  const [showDrawer, setShowDrawer] = useState(false);

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

  const showMenu = () => {
    return menuButtons.map((item, i) => {
      return <li className="menu-btn"><Button onClick={(e) => menuAction(e, item)}>{item}</Button></li>
    })
  }

  const menuAction = (e, item) => {
    switch(item){
      case "New":
        console.log("New Jam");
        return;
      case "Open":
        console.log("Open Jam");
        return;
      case "Save":
        console.log("Save Jam");
        return;
      default:
        return;
    }
  }
  
  return (
    <JamContext.Provider value={{dataState: state, dataDispatch: dispatch}}>
        <div className="App">
            <h1>Jam Out</h1>
              <div className="side-menu">
                <Button
                  className='side-btn'
                  title="Open Drawer"
                  onClick={() => {setShowDrawer(true)}}
                />
                  <Drawer 
                      actions={
                          <Button size="small">
                              Sign in
                          </Button>
                      }
                      onClose={() =>{
                          setShowDrawer(false);
                      }}
                      shown={showDrawer}
                  >
                      <ul>
                        {showMenu()}
                      </ul>
                  </Drawer>
              </div>
            <Composition/>
              
            <Keyboard/>
        </div>
      </JamContext.Provider>

  );
}

export default App;
