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

let music_list = [];
fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    music_list = data;
    loadTrack(track_index);
    displaySongList();
  })
  .catch((error) => console.error("Error loading songs:", error));

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
// Function to show notification messages
function showNotification(message, color = "green") {
  let notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.background = color;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000); // Hide after 3 seconds
}

// Function to toggle Playlist modal
function toggleSongList() {
  let modal = document.getElementById("playlistModal");
  modal.classList.toggle("hidden");
  displaySongList(); // Ensure it updates
}

// Function to toggle Manage Songs modal
function toggleManageSongs() {
  let modal = document.getElementById("manageSongsModal");
  modal.classList.toggle("hidden");
}

// Function to display song list dynamically
function displaySongList() {
  let songListContainer = document.querySelector(".song-list");
  songListContainer.innerHTML = ""; // Clear previous list

  music_list.forEach((song, index) => {
    let songItem = document.createElement("div");
    songItem.classList.add("song-item");
    songItem.innerHTML = `
          <img src="${song.img}" alt="${song.name}" class="song-thumb">
          <div class="song-info">
              <h3>${song.name}</h3>
              <p>${song.artist}</p>
          </div>
      `;
    songItem.onclick = () => {
      track_index = index;
      loadTrack(track_index);
      playTrack();
    };
    songListContainer.appendChild(songItem);
  });
}

// Function to extract filename without extension
function getFileName(file) {
  return file.name.replace(/\.[^/.]+$/, "");
}
// Function to add a new song
function addSong() {
  let artist = document.getElementById("song-artist").value;
  let songInput = document.getElementById("song-upload");
  let coverInput = document.getElementById("cover-upload");

  let songFile = songInput.files[0];
  let coverFile = coverInput.files[0];

  if (artist && songFile && coverFile) {
    let coverURL = URL.createObjectURL(coverFile);
    let songURL = URL.createObjectURL(songFile);
    let songName = getFileName(songFile);

    let newSong = {
      img: coverURL,
      name: songName, // Extracted from file name
      artist: artist,
      music: songURL,
    };

    music_list.push(newSong);
    displaySongList();
    showNotification("Song added successfully!");

    // Clear input fields
    document.getElementById("song-artist").value = "";
    document.getElementById("cover-upload").value = "";
    document.getElementById("song-upload").value = "";

    toggleManageSongs(); // Close modal after adding
  } else {
    alert("Please fill in all fields.");
  }
}

// Function to remove the currently playing song
function removeSong() {
  if (music_list.length > 1) {
    music_list.splice(track_index, 1);
    track_index = track_index % music_list.length;
    loadTrack(track_index);
    displaySongList();
    showNotification("Song removed!", "red");

    toggleManageSongs();
  } else {
    alert("Cannot remove the last song.");
  }
}
// Save songs to songs.json (Requires a backend)
function saveSongsToJSON() {
  fetch("/save-songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(music_list),
  })
    .then((response) => response.json())
    .then((data) => console.log("Songs saved:", data))
    .catch((error) => console.error("Error saving songs:", error));
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
  document
    .getElementById("playlistModal")
    .querySelector(".modal-content").style.background = gradient;
  document
    .getElementById("manageSongsModal")
    .querySelector(".modal-content").style.background = gradient;

  document.querySelectorAll(".loader .stroke").forEach((el) => {
    el.style.background = Color1;
  });

  // Create a new @keyframes rule for dynamic animation
  let styleSheet = document.getElementById("dynamicStyles");
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = "dynamicStyles";
    document.head.appendChild(styleSheet);
  }
  styleSheet.innerHTML = `
      @keyframes animate {
        50% { height: 20%; background: ${Color2}; }
        100% { height: 100%; }
      }
      .loader .stroke {
        background: ${Color1} !important;
      }
    `;
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
