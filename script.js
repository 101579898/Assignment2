const tracks = [
  {
    title: 'Lover/Friend ft. Rochelle Jordan',
    artist: 'KAYTRANADA',
    desc: "Lover/Friend is a song by KAYTRANADA, released in 2021. It features a blend of electronic and R&B elements, showcasing KAYTRANADA's signature production style. The track is known for its smooth beats and catchy melodies, making it a standout in KAYTRANADA's discography.",
    audio: 'audio/lover.mp3'
  },
  {
    title: 'Witchy ft. Childish Gambino',
    artist: 'KAYTRANADA',
    desc: 'Witchy with Childish Gambino.',
    audio: 'audio/Witchy.mp3'
  },
  {
    title: 'Spit it Out Ft. Rochelle Jordan',
    artist: 'KAYTRANADA',
    desc: 'Rochelle Jordan and KAYTRANADA create a dance track.',
    audio: 'audio/spit.mp3'
  }
];

const songTitle = document.getElementById('songtitle');
const songArtist = document.getElementById('songartist');
const songDesc = document.getElementById('songdesc');
const trackListEl = document.getElementById('trackList');
const waveformEl = document.getElementById('waveform');
const progressFill = document.getElementById('progressFill');
const timeElapsedEl = document.getElementById('timeelapsed');
const timeTotalEl = document.getElementById('timetotal');
const armEl = document.getElementById('arm');

let currentTrack = 0;
let isPlaying = false;
let progressInterval = null;
let startTime = 0;
let loopDuration = 1;

const players = tracks.map(t => new Tone.Player(t.audio).toDestination());

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateUI() {
  const t = tracks[currentTrack];
  songTitle.textContent = t.title;
  songArtist.textContent = t.artist;
  songDesc.textContent = t.desc;

  armEl.classList.toggle('on', isPlaying);
  document.querySelector('.cd').classList.toggle('playing', isPlaying);

  const playButton = document.getElementById('btnPlay');
  playButton.textContent = isPlaying ? '⏸' : '▶';
  playButton.classList.toggle('btn-pause', isPlaying);
  playButton.classList.toggle('btn-play', !isPlaying);

  document.querySelectorAll('.track-item').forEach((el, index) => {
    el.classList.toggle('active', index === currentTrack);
  });

  document.querySelectorAll('.wave-bar').forEach(bar => {
    bar.style.background = isPlaying ? 'linear-gradient(to top, #fa52a9, #ffb3d9)' : '#f0e8f0';
  });
}

function clearProgress() {
  clearInterval(progressInterval);
  progressFill.style.width = '0%';
  timeElapsedEl.textContent = '0:00';
  timeTotalEl.textContent = fmt(loopDuration);
}

async function playTrack(idx) {
  if (idx < 0 || idx >= players.length) return;

  players.forEach((p, i) => {
    if (i !== idx) p.stop();
  });
  players[idx].stop();

  await Tone.start();

  currentTrack = idx;
  isPlaying = true;
  const player = players[idx];

  if (player.buffer && player.buffer.duration) {
    loopDuration = player.buffer.duration;
  } else {
    loopDuration = 1;
  }

  player.start();
  startTime = Date.now();

  clearProgress();

  progressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const pct = Math.min((elapsed / loopDuration) * 100, 100);
    progressFill.style.width = `${pct}%`;
    timeElapsedEl.textContent = fmt(Math.min(elapsed, loopDuration));
    timeTotalEl.textContent = fmt(loopDuration);

    if (elapsed >= loopDuration) {
      player.stop();
      isPlaying = false;
      clearProgress();
      updateUI();
    }
  }, 100);

  updateUI();
}

function pausePlay() {
  const player = players[currentTrack];
  if (!player) return;

  if (isPlaying) {
    player.stop();
    isPlaying = false;
    clearProgress();
  } else {
    player.start();
    isPlaying = true;
    startTime = Date.now() - (parseFloat(progressFill.style.width || 0) / 100) * loopDuration * 1000;

    progressInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const pct = Math.min((elapsed / loopDuration) * 100, 100);
      progressFill.style.width = `${pct}%`;
      timeElapsedEl.textContent = fmt(Math.min(elapsed, loopDuration));

      if (elapsed >= loopDuration) {
        player.stop();
        isPlaying = false;
        clearProgress();
        updateUI();
      }
    }, 100);
  }

  updateUI();
}

// build waveform
for (let i = 0; i < 40; i++) {
  const bar = document.createElement('div');
  bar.className = 'wave-bar';
  bar.style.height = `${Math.random() * 24 + 4}px`;
  waveformEl.appendChild(bar);
}

// build playlist
tracks.forEach((track, i) => {
  const item = document.createElement('div');
  item.className = 'track-item' + (i === 0 ? ' active' : '');
  item.innerHTML = `
    <img src="images/albumcover.png" class="track-thumb-img" alt="cover" />
    <div class="track-info">
      <div class="track-name">${track.title}</div>
      <div class="track-by">${track.artist}</div>
    </div>
    <div class="track-duration">∞ loop</div>
    <div class="track-playing-indicator">
      <div class="bars">
        <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
      </div>
    </div>`;

  item.addEventListener('click', () => playTrack(i));
  trackListEl.appendChild(item);
});

document.getElementById('btnPlay').addEventListener('click', pausePlay);
document.getElementById('btnPrev').addEventListener('click', () => playTrack((currentTrack - 1 + tracks.length) % tracks.length));
document.getElementById('btnNext').addEventListener('click', () => playTrack((currentTrack + 1) % tracks.length));
document.getElementById('progressWrap').addEventListener('click', (e) => {
  if (!isPlaying) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const seekSeconds = pct * loopDuration;
  startTime = Date.now() - seekSeconds * 1000;
  progressFill.style.width = `${pct * 100}%`;
  timeElapsedEl.textContent = fmt(seekSeconds);
});

Tone.loaded().then(() => {
  // Initialize with first track metadata
  loopDuration = players[0].buffer?.duration || 1;
  timeTotalEl.textContent = fmt(loopDuration);
  updateUI();
});

