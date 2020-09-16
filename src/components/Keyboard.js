import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Piano, MidiNumbers, KeyboardShortcuts } from 'react-piano';
import 'react-piano/dist/styles.css';
import { ListOfSynths } from './Synths';
import { Donut } from 'react-dial-knob';

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

    const playNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, 'midi').toNote();
        osc.sound.volume.value = volume;

        osc.sound.triggerAttack(savedNote, timeNow).toDestination();
    }

    const stopNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, "midi").toNote();
        osc.sound.volume.value = volume;
        osc.sound.triggerRelease(savedNote, timeNow + 0.1);
    }

    return(
        <div className={'piano-container'}>
           <Piano
                noteRange={{first: firstNote, last: lastNote}}
                playNote={(note) => {playNote(note)}}
                stopNote={(note) => {stopNote(note)}}
                width={1000}
                keyboardShortcuts={keyboardShortcuts}
           />
           <label id={'volume-label'}>Volume: </label>
            <Donut
                diameter={150}
                min={-60}
                max={60}
                step={1}
                value={volume}
                theme={{
                    donutColor: 'blue'
                }}
                onValueChange={setVolume}
                ariaLabelledBy={'volume-label'}
            >
                
            </Donut>

           <h3>Synths</h3>
           
        </div>
    )
}

export default Keyboard;