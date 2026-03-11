const synth = new Tone.Synth().toDestination();

const playButton = document.getElementById('playButton');

playButton.addEventListener('click', async () => {
    // Start Tone.js context if not running
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
    // Play a note
    synth.triggerAttackRelease("C4", "8n");
}); 