// /assets/songs/

  const playBtn = document.getElementById("playBtn");
  const circle = document.querySelector("#circle");
  const timeStamp = document.querySelector(".timeStamp");
  
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const seekbar = document.querySelector(".seekbar");
  const menuBtn = document.querySelector(".hamburger");
  const cancelBtn = document.querySelector(".cancel");

console.log("let's write js");
let currentSong = new Audio();
let songs = [];
let currentFolder;
let currentTrack;
const songInFo = document.querySelector(".songInfo");
async function getSongs(folder) {
  currentFolder = folder;

  // Load songs from songs.json
  let response = await fetch(`/assets/${folder}/songs.json`);
  let songs = await response.json();

  // Display songs
  let songUL = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML += `
      <li data-song="${song}">
        <img class="invert" src="assets/icons/play-Img.svg" alt="play-Img">

        <div class="songInFo">
          <div class="songName">
            ${
              song
                .replaceAll("-", " ")
                .replace(".mp3", "")
                .slice(0, -6)
                .split(" ")[1] +
              " " +
              song
                .replaceAll("-", " ")
                .replace(".mp3", "")
                .slice(0, -6)
                .split(" ")[2]
            }
          </div>

          <div class="artistName">
            ${
              song
                .replaceAll("-", " ")
                .replace(".mp3", "")
                .slice(0, -6)
                .split(" ")[0]
            }
          </div>
        </div>

        <img
          class="invert"
          id="playBtnLiberay"
          src="assets/icons/playbtn.svg"
          alt=""
        >
      </li>`;
  }

  // Add click events
  Array.from(document.querySelectorAll(".song-list li")).forEach((li) => {
    li.addEventListener("click", () => {
      let track = li.dataset.song;

      console.log("Playing:", track);

      playMusic(track);
      playBtn.src = "assets/icons/pause.svg";
    });
  });

  return songs;
}
// let currentSong;

function playMusic(track, pause = false){
 

    currentTrack = track;

    currentSong.src = `assets/${currentFolder}/${track}`;

    updateSongInfo(track);

    if(!pause){
        currentSong.play();
        playBtn.src = "assets/icons/pause.svg";
    }
}

function updateSongInfo(track){

    let parts = track
        .replace(".mp3", "")
        .slice(0, -6)
        .replaceAll("-", " ")
        .split(" ");

    let artist = parts[0];
    let songName = parts.slice(1).join(" ");

    songInFo.innerHTML = `
        <div class="songName">${songName}</div>
        <div class="artistName">${artist}</div>
    `;
}
// async function playMusic(track) {
//   let songs = await getSongs();
//   // currentSong = songs.includes(track)
//   for (const song of songs){
//     if(songs.includes(track)){
//       let audio = new Audio(`assets/songs/${song}`)
//         audio.play()

//     }
//   }
// }
//for displaying the albums
async function displayAlbums() {

    let folders = [
        "1nanuFav",
        "AravindFav",
        "deekshaFav",
        "LuxFav"
    ];

    let cardContainer = document.querySelector(".cardContainer");

    cardContainer.innerHTML = "";

    for (const folder of folders) {

        let a = await fetch(`/assets/songs/${folder}/info.json`);
        let response = await a.json();

        cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">

            <div class="playButton">
                ...
            </div>

            <img src="/assets/songs/${folder}/cover.jpg">

            <h2>${response.title}</h2>
            <p>${response.description}</p>

        </div>`;
    }
}
async function main() {


 // displaying the albums
    await displayAlbums()
  // get the list of the songs
  songs = await getSongs("songs/1nanuFav");
  playMusic(songs[0], true);
  playBtn.src = "assets/icons/playbtn.svg";
  // console.log(songs);


   
  
  function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    
    let secs = Math.floor(seconds % 60);
    
    if (secs < 10) {
      secs = "0" + secs;
    }
    
    return `${mins}:${secs}`;
  }
  //Play the song {adding click event to all list items}

 
  currentSong.addEventListener("timeupdate", () => {
    timeStamp.innerText = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

    let percent = (currentSong.currentTime / currentSong.duration) * 100;

    circle.style.left = percent + "%";
  });
  playBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playBtn.src = "assets/icons/pause.svg";
    } else {
      currentSong.pause();
      playBtn.src = "assets/icons/playbtn.svg";
    }
  });
  nextBtn.addEventListener("click", () => {
    let index = songs.indexOf(currentTrack);

    if (index === -1) return;

    if (index === songs.length - 1) {
      playMusic(songs[0]);
    } else {
      playMusic(songs[index + 1]);
    }
  });
  prevBtn.addEventListener("click", () => {
    let index = songs.indexOf(currentTrack);
    if (index == -1) return;

    if (index === 0) {
      playMusic(songs[songs.length - 1]);
    } else {
      playMusic(songs[index - 1]);
    }
  });
  currentSong.addEventListener("ended", () => {
    let index = songs.indexOf(currentTrack);

    if (index === songs.length - 1) {
      playMusic(songs[0]);
    } else {
      playMusic(songs[index + 1]);
    }
  });
  seekbar.addEventListener("click", (e) => {

    let percent =
    (e.offsetX / seekbar.getBoundingClientRect().width) * 100;

    currentSong.currentTime =
    (currentSong.duration * percent) / 100;

});
document.getElementById("volumeInput")
.addEventListener("input", (e) => {

    currentSong.volume = e.target.value / 100;
    if(currentSong.volume==0){
      document.getElementById("volumeBtn").src="assets/icons/volumeOff.svg"
    }
    else{
      document.getElementById("volumeBtn").src="assets/icons/volume.svg"
    }

  });
  menuBtn.addEventListener("click", () => {
  
      const sidebar = document.querySelector(".left");
  
      sidebar.classList.toggle("active");  
  });
  cancelBtn.addEventListener("click", () => {
  
      const sidebar = document.querySelector(".left");
  
      sidebar.classList.toggle("active");  
  });

}

main();