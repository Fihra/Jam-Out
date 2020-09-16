import * as Tone from 'tone';

const regular = {
    name: "Synth",
    sound: new Tone.PolySynth({
        voice:Tone.Synth
    })
}

const second = {
    name: "AMSynth",
    sound: new Tone.PolySynth({
        voice: Tone.AMSynth
    })
}

const third = {
    name: "FMSynth",
    sound: new Tone.PolySynth({
        voice: Tone.FMSynth
    })
}

export const ListOfSynths = [regular, second, third];