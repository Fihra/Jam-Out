import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Piano, MidiNumbers, KeyboardShortcuts } from 'react-piano';
import 'react-piano/dist/styles.css';
import { ListOfSynths } from './Synths';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

const SynthManager = {
    name: "Default Synth",
    sound: new Tone.PolySynth({
        voice: Tone.Synth
    })
}

const firstNote = MidiNumbers.fromNote('C3');
const lastNote = MidiNumbers.fromNote('F4');
const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
})

const Keyboard = () => {
    const [osc, setOsc] = useState(SynthManager);
    const [volume, setVolume] = useState(0);

    const [attackLevel, setAttackLevel] = useState(1);
    const [decayLevel, setDecayLevel] = useState(1);
    const [sustainLevel, setSustainLevel] = useState(1);
    const [releaseLevel, setReleaseLevel] = useState(1);

    const playNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, 'midi').toNote();
        osc.sound.volume.value = volume;

        osc.sound.set({
            envelope: {
                attack: attackLevel,
                decay: decayLevel,
                sustain: sustainLevel,
                release: releaseLevel
            }
        })

        osc.sound.triggerAttack(savedNote, timeNow).toDestination();
    }

    const stopNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, "midi").toNote();
        osc.sound.volume.value = volume;
        osc.sound.triggerRelease(savedNote, timeNow + 0.1);
    }

    const SynthChoice = () => {
        return ListOfSynths.map((synthy, index) => {
            return <option key={index} value={index}>{synthy.name}</option>
        })
    }

    const handleChange = (event) => {
        event.persist();
        let result = ListOfSynths[event.target.value];
        setOsc({sound: result.sound})
    }
   
    return(
        <div className='keyboard-container'>
            <div className='keyboard-settings'>
                {/* Volume */}
                <label id={'volume-label'}>Volume: {volume}</label>
                    <Slider
                        min={-25}
                        max={25}
                        value={volume}
                        orientation="vertical"
                        onChange={(e) => setVolume(e)}
                        
                    />
                {/* Synths */}
                    <h3>Synths</h3>
                <select onChange={e => handleChange(e)}>
                    {SynthChoice()}
                </select>
                
                {/* ADSR */}
                <h3>ADSR</h3>
                <label className="adsr-label">Attack: {attackLevel}</label>
                <Slider
                        min={0.0}
                        max={1.0}
                        step={0.01}
                        value={attackLevel}
                        orientation="vertical"
                        onChange={(e) =>setAttackLevel(parseFloat(e).toFixed(2))}
                />
                <label className="adsr-label">Decay: {decayLevel}</label>
                <Slider
                        min={0.0}
                        max={1.0}
                        step={0.01}
                        value={decayLevel}
                        orientation="vertical"
                        onChange={(e) =>setDecayLevel(parseFloat(e).toFixed(2))}
                />
                <label className="adsr-label">Sustain: {sustainLevel}</label>
                <Slider
                        min={0.0}
                        max={1.0}
                        step={0.01}
                        value={sustainLevel}
                        orientation="vertical"
                        onChange={(e) =>setSustainLevel(parseFloat(e).toFixed(2))}
                />
                <label className="adsr-label">Release: {releaseLevel}</label>
                <Slider
                        min={0.0}
                        max={1.0}
                        step={0.01}
                        value={releaseLevel}
                        orientation="vertical"
                        onChange={(e) =>setReleaseLevel(parseFloat(e).toFixed(2))}
                />
            </div>
            {/* Piano Keyboard */}
            <div className={'piano-container'}>
            <Piano
                noteRange={{first: firstNote, last: lastNote}}
                playNote={(note) => {playNote(note)}}
                stopNote={(note) => {stopNote(note)}}
                width={1000}
                keyboardShortcuts={keyboardShortcuts}
            />
            </div>
        </div>
        
    )
}

export default Keyboard;