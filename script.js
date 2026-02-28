// all your Tone.js synths
const synth = new Tone.Synth().toDestination();

// all your functions
function playTrack() {
    synth.triggerAttackRelease("A4", "8n");
}
