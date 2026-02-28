// all your Tone.js synths
const synth = new Tone.Synth().toDestination();

// all your functions
function playTrack() {
    synth.triggerAttackRelease("A4", "8n");
}

// all your button listeners
document.getElementById("btnPlay").addEventListener("click", playTrack);

// all your animation logic
function spinVinyl() {
    document.querySelector(".vinyl").classList.add("playing");
}
