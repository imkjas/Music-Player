let now_playing = document.querySelector(".now-playing");
let song_art = document.querySelector(".song-art");
let song_name = document.querySelector(".song-name");
let song_artist = document.querySelector(".song-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let time_slider = document.querySelector(".time-slider");
let volume_slider = document.querySelector(".volume-slider");
let curr_time = document.querySelector(".current-time");
let total_dur = document.querySelector(".duration");

let wave = document.getElementById("wave");
let randomIcon = document.querySelector(".fa-random");
let curr_track = document.createElement("audio");

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
  {
    img: "music/cover.jpg",
    name: "02 - Traitor",
    artist: "Olivia Rodrigo",
    music: "./music/02 - traitor.mp3",
  },
  {
    img: "music/cover2.jpg",
    name: "03 - Drivers License",
    artist: "Olivia Rodrigo",
    music: "./music/03 - drivers license.mp3",
  },
  {
    img: "music/cover.jpg",
    name: "05 - deja vu",
    artist: "Olivia Rodrigo",
    music: "./music/05 - deja vu.mp3",
  },
  {
    img: "music/cover2.jpg",
    name: "06 - Good 4 U",
    artist: "Olivia Rodrigo",
    music: "./music/06 - good 4 u.mp3",
  },
];

loadTrack(track_index);

function loadTrack(track_index) {
  clearInterval(updateTimer);
  reset();

  curr_track.src = music_list[track_index].music;
  curr_track.load();

  song_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
  song_name.textContent = music_list[track_index].name;
  song_artist.textContent = music_list[track_index].artist;
  now_playing.textContent = track_index + 1 + " of " + music_list.length;

  updateTimer = setInterval(setUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
}

function random_bg_color() {
  let hex = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];
  let a;
  function populate(a) {
    for (let i = 0; i < 6; i++) {
      let x = Math.round(Math.random() * 14);
      let y = hex[x];
      a = a + y;
    }
    return a;
  }

  let Color1 = populate("#");
  let Color2 = populate("#");
  var angle = "to right";
  let gradient = "linear-gradient(" + angle + "," + Color1 + "," + Color2 + ")";
  document.body.style.background = gradient;
}

function reset() {
  curr_time.textContent = "00:00";
  total_dur.textContent = "00:00";
  time_slider.value = 0;
}

function randomTrack() {
  isRandom = !isRandom;
  randomIcon.classList.toggle("randomActive", isRandom);
}

function repeatTrack() {
  let current_index = track_index;
  loadTrack(current_index);
  playTrack();
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  song_art.classList.add("rotate");
  wave.classList.add("loader");
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  song_art.classList.remove("rotate");
  wave.classList.remove("loader");
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < music_list.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < music_list.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * music_list.length);
    track_index = random_index;
  } else {
    track_index = 0;
  }

  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = music_list.length - 1;
  }

  loadTrack(track_index);
  playTrack();
}

function timeTo() {
  let timeToUpdate = curr_track.duration * (time_slider.value / 100);
  curr_track.currentTime = timeToUpdate;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function setUpdate() {
  let timePosition = 0;
  if (!isNaN(curr_track.duration)) {
    timePosition = curr_track.currentTime * (100 / curr_track.duration);
    time_slider.value = timePosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_dur.textContent = durationMinutes + ":" + durationSeconds;
  }
}
