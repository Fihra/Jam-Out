import React, { useState, useContext, useEffect } from 'react';
import { JamContext } from '../App';
import * as Tone from 'tone';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

let plucker = new Tone.PluckSynth().toDestination();
let kickSynth = new Tone.MembraneSynth().toDestination();
let cymbalSynth = new Tone.MetalSynth(
    {
        frequency : 20 ,
        envelope : {
        attack : 0.025 ,
        decay : 0.5,
        release : 0.5
        }
        ,
        harmonicity : 5.1 ,
        modulationIndex : 32 ,
        resonance : 2000 ,
        octaves : 0.5
    }        
).toDestination(); 
let snareSynth = new Tone.MembraneSynth({
    pitchDecay : 0.05 ,
    octaves : 10 ,
    oscillator : {
    type : 'sine'
    }
    ,
    envelope : {
    attack : 0.001 ,
    decay : 0.4 ,
    sustain : 0.01 ,
    release : 1.4 ,
    attackCurve : 'exponential'
    } 
}).toDestination();

let synthPart;
let kickPart;
let cymbalPart;
let snarePart;

const Composition = () => {
    const {dataState} = useContext(JamContext);
    
    const [title, setTitle] = useState("")
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [tempo, setTempo] = useState("");
    const [notes, setNotes] = useState("");

    //Drum Machine
    const [kickNotes, setKickNotes] = useState("");
    const [cymbalNotes, setCymbalNotes] = useState("");
    const [snareNotes, setSnareNotes] = useState("");

    const [isPlaying, setIsPlaying] = useState(false);
    console.log(dataState.data);
    useEffect(() =>{
        if(Object.entries(dataState.data).length !==0){
            const { title, username, description, tempo, notes, bassDrumNotes, cymbalNotes, snareNotes } = dataState.data[0];
            setTitle(title);
            setUsername(username);
            setDescription(description);
            setTempo(tempo);
            setNotes(parsingNotes(notes));
            setKickNotes(parsingNotes(bassDrumNotes));
            setCymbalNotes(parsingNotes(cymbalNotes));
            setSnareNotes(parsingNotes(snareNotes));

        }
    }, [dataState])

    useEffect(() => {
        if(notes !== "") {        
            if(isPlaying){    
                setupParts();

                synthPart.start();
                kickPart.start();
                // cymbalPart.start();
                snarePart.start();

                Tone.Transport.bpm.value = tempo;
                Tone.Transport.start();
            } else{
                synthPart.stop();
                kickPart.stop();
                cymbalPart.stop();
                snarePart.stop();
                Tone.Transport.cancel(0);
                Tone.Transport.stop();
            }
        }
        
    }, [isPlaying])

    const setupParts = () => {
        synthPart = new Tone.Sequence(((time, note) => {
            plucker.triggerAttackRelease(note, "10hz", time + 0.1);
        }), notes,"16n");

        kickPart = new Tone.Sequence((time, note) => {
            kickSynth.triggerAttackRelease(note, "5hz", time + 0.1);
        }, kickNotes, "16n");

        cymbalPart = new Tone.Sequence((time, note) => {
            cymbalSynth.triggerAttackRelease(note, "2hz", time + 0.1);
        }, cymbalNotes, "16n");

        snarePart = new Tone.Sequence((time, note) => {
            snareSynth.triggerAttackRelease(note, "16n", time + 0.1);
        }, snareNotes, "16n");
    }

    //Jam Song Detail information
    //Title, Username, Description, Tempo
    const showDetails = () =>{
        return(
            <div>
                <h2>{title} by {username}</h2>
                <div className="tempo-slider">
                    <p><label>Tempo: {tempo}</label></p>
                    <Slider 
                            min={40}
                            max={280}
                            value={tempo}
                            orientation="horizontal"
                            onChange={(e) => setTempo(e)}
                    />
                </div>
                <p>{description}</p>   
            </div>
        )
    }

    //Show the music notes 
    const showComposition = () => {   
        return notes.map((note, i) => {
            return (
                <div key={i} className="note-container">
                    <label>{typeof(note) === 'object' ? "Rest" : note}</label>
                </div>
            )
        })
    }

    const playKickDrum = () => {
        return kickNotes.map((kick, i) => {
            return <div key={i} className="kick-box">
                {kick !== null ? <span className="kick-on"></span> : <span className="kick-off"></span>}
            </div>
        })
    }

    const playCymbal = () => {
        return cymbalNotes.map((cymbal, i) => {
            return <div key={i} className="cymbal-box">
                {cymbal !== null ? <span className="cymbal-on"></span> : <span className="cymbal-off"></span>}
            </div>
        })
    }

    const playSnare = () => {
        return snareNotes.map((snare, i) => {
            return <div key={i} className="snare-box">
                {snare !== null ? <span className="snare-on"></span> : <span className="snare-off"></span>}
            </div>
        })
    }

    //used to Parse backend fetched data translatable for Tone.js
    const parsingNotes = (notes) => {
       let parsedNotes = notes.split("-").map((note) => {
            if(note === "null") return null
            return note
       })   
       return parsedNotes;
    }

    return(
        <div className="composition-container">
            <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Stop" : "Play"}</button>
            {Object.entries(dataState.data).length !==0 ? showDetails() : null }
                <div className="music-container">
                    {notes.length !== 0 ? showComposition() : null }
                    <div className="drums-container">
                    <label>Kick</label>{notes.length !== 0 ? playKickDrum() : null }
                    <br></br>
                    <label>Cymbal</label>{notes.length !== 0 ? playCymbal() : null }
                    <br></br>
                    <label>Snare</label>{notes.length !== 0 ? playSnare() : null }
                </div>
            </div>
        </div>
    )
}

export default Composition;