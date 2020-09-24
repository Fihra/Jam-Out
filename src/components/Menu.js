import React, { useState, useContext, useEffect } from 'react';
import { JamContext } from '../App';
import Drawer from "@kiwicom/orbit-components/lib/Drawer";
import Button from '@kiwicom/orbit-components/lib/Button';
import ListChoice from "@kiwicom/orbit-components/lib/ListChoice";
import List from "@kiwicom/orbit-components/lib/List";
import Actions from './Actions';

const Menu = () => {
    const jamContext = useContext(JamContext);

    const [showDrawer, setShowDrawer] = useState(false);
    const [openJams, setOpenJams] = useState(false);
    const menuButtons = ["New", "Open", "Save"];
    // console.log(jamContext.dataState);

    const newJam = {
        username: "Musician Name",
        title: "Untitled",
        description: "Insert Description",
        tempo: 120,
        notes: "C2-Eb2-G2-Eb2-null-Ab2-G2-null-Eb2-Bb1-Eb2-Bb1-Ab2-G2-null-Bb2",
        bassDrumNotes: "null-null-null-null-null-null-null-null-null-null-null-null-null-null-null-null",
        cymbalNotes: "null-null-null-null-null-null-null-null-null-null-null-null-null-null-null-null",
        snareNotes: "null-null-null-null-null-null-null-null-null-null-null-null-null-null-null-null"
    }

    useEffect(() =>{
        // console.log(jamContext.dataState);
    }, [jamContext.dataState])

    const showMenu = () => {
        return menuButtons.map((item, i) => {
          return <li className="menu-btn"><Button onClick={(e) => menuAction(e, item)}>{item}</Button></li>
        })
      }

    const menuAction = (e, item) => {
        switch(item){
            case "New":
                console.log("New Jam");
                jamContext.dataDispatch({type: Actions.NEW_JAM, payload: newJam});
                return;
            case "Open":
                if(openJams){
                    setOpenJams(false);
                } else{
                    setOpenJams(true)
                }
            case "Save":
                console.log("Save Jam");
                const savedJam = jamContext.dataState.data[jamContext.dataState.jamIndex];
                // console.log(jamContext.dataState.currentJam);
                console.log(savedJam);
                // jamContext.dataDispatch({type: Actions.UPDATE_JAM, payload: savedJam})
                return;
            default:
                return;
        }
    }

    const showJams = () =>{
        return jamContext.dataState.data.map((jam, i) => {
            return (<ListChoice
                description={jam.description}
                onClick={() => jamContext.dataDispatch({type: Actions.OPEN_JAM, payload: i})}
                title={`${jam.title} by ${jam.username}`}
            />)
        })
    }

    return(
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
              {Object.entries(jamContext.dataState.data).length !==0 && openJams ? showJams() : null}
          </Drawer>
      </div>
    )
}

export default Menu;