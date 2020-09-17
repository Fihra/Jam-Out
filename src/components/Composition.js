import React, { useState, useContext, useEffect } from 'react';
import { JamContext } from '../App';
import * as Tone from 'tone';

let plucker = new Tone.PluckSynth().toDestination();
// let kickSynth = new Tone.MembraneSynth().toDestination();
// let cymbalSynth = new Tone.MetalSynth();
let synthPart;
const Composition = () => {
    const {dataState} = useContext(JamContext);
    
    const [title, setTitle] = useState("")
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [tempo, setTempo] = useState("");
    const [notes, setNotes] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    

    useEffect(() =>{
        if(Object.entries(dataState.data).length !==0){
            const { title, username, description, tempo, notes } = dataState.data[0];
            setTitle(title);
            setUsername(username);
            setDescription(description);
            setTempo(tempo);
            setNotes(parsingNotes(notes));

        }
    }, [dataState])

    useEffect(() => {
        if(notes !== "") {        
            if(isPlaying){    
                synthPart = new Tone.Sequence(((time, note) => {
                    plucker.triggerAttackRelease(note, "10hz", time + 0.1);
                }), notes,"16n");

                synthPart.start();
                Tone.Transport.bpm.value = tempo;
                Tone.Transport.start();
            } else{
                synthPart.stop();
                Tone.Transport.cancel(0);
                Tone.Transport.stop();
            }
        }
        
    }, [isPlaying])

    const showDetails = () =>{
        return(
            <div>
                <h2>{title} by {username}</h2>
                <p><label>Tempo: {tempo}</label></p>
                <p>{description}</p>   
            </div>
        )
    }

    const showComposition = () => {   
        return notes.map((note, i) => {
            return (
                <div key={i} className="note-container">
                    <label>{typeof(note) === 'object' ? "Rest" : note}</label>
                </div>
            )
        })
    }

    const parsingNotes = (notes) => {
       let parsedNotes = notes.split("-").map((note) => {
            if(note === "null") {
                return null
            }
            return note
       })
       
       return parsedNotes;
    }

    const showNotes = (parsedNotes) => {
        return parsedNotes.map((note, i) =>{
            return(
                // <div>
                //     <label>{typeof(note) === 'object' ? 'Rest' : note}</label>
                //     <div onChange={(e) => console.log(e)}>
                //         {note}
                //     </div>
                // </div>
                <p>{note}</p>
            )
        })
    }

    return(
        <div>
            <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Stop" : "Play"}</button>
            {Object.entries(dataState.data).length !==0 ? showDetails() : null }
            <div className="music-container">
            {notes.length !== 0 ? showComposition() : null }
            </div>
        </div>
    )
}

export default Composition;