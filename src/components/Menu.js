import React, { useState, useContext, useEffect } from 'react';
import { JamContext } from '../App';
import Drawer from "@kiwicom/orbit-components/lib/Drawer";
import Button from '@kiwicom/orbit-components/lib/Button';
import ListChoice from "@kiwicom/orbit-components/lib/ListChoice";
import List from "@kiwicom/orbit-components/lib/List";

const Menu = () => {
    const jamContext = useContext(JamContext);

    const [showDrawer, setShowDrawer] = useState(false);
    const [openJams, setOpenJams] = useState(false);
    const menuButtons = ["New", "Open", "Save"];
    console.log(jamContext.dataState);

    useEffect(() =>{
        console.log(jamContext.dataState);
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
                return;
            case "Open":
                if(openJams){
                    setOpenJams(false);
                } else{
                    setOpenJams(true)
                }
            case "Save":
                console.log("Save Jam");
                return;
            default:
                return;
        }
    }

    const showJams = () =>{
        return jamContext.dataState.data.map((jam, i) => {
            return (<ListChoice
                description={jam.description}
                onClick={() => jamContext.dataDispatch({type: 'OPEN_JAM', payload: i})}
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