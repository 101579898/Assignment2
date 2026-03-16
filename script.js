const synth = new Tone.Synth().toDestination();

const playButton = document.getElementById('playButton');

playButton.addEventListener('click', async () => {
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
    // Play a note
    synth.triggerAttackRelease("C4", "8n");
}); 

const player = new Tone.Player("audio/lover.mp3").toDestination();
Tone.loaded().then(() => {
    player.start();
});

const arm = document.getElementById('arm');
player.on('start', () => {
    arm.classList.add('on');
});

player.on('stop', () => {
    arm.classList.remove('on');
}); 

const tracks = [
    {
        title: "Lover/Friend ft. Rochelle Jordan",
        artist: "KAYTRANADA",
        desc: "Lover/Friend is a song by KAYTRANADA, released in 2021. It features a blend of electronic and R&B elements, showcasing KAYTRANADA's signature production style. The track is known for its smooth beats and catchy melodies, making it a standout in KAYTRANADA's discography.",
        audio: "audio/lover.mp3"
    },  
    {
        title: "Witchy ft. Childish Gambino",
        artist: "KAYTRANADA",
        desc: "Witchy with Childish Gambino.",
        audio: "audio/Witchy.mp3"
    },
     {
        title: "Spit it Out Ft. Rochelle Jordan",
        artist: "KAYTRANADA",
        desc: "Rochelle Jordan and KAYTRANADA, create a dance track",
        audio: "audio/spit.mp3"
    }
];

const songTitle = document.getElementById('songtitle');
const songArtist = document.getElementById('songartist');
const songDesc = document.getElementById('songdesc');