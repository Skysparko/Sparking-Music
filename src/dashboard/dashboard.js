import { fetchRequest } from "../api";
import { ENDPOINT, LOGOUT, SECTIONS } from "../comman";

let trackList = [];
const home = document.getElementById("home");
home.setAttribute(
  "href",
  `${import.meta.env.VITE_APP_URL}dashboard/dashboard.html`
);

const audio = new Audio();
const previous = document.getElementById("prev");
const next = document.getElementById("next");
const play = document.getElementById("play");
const songDurationCompleted = document.getElementById(
  "song-duration-completed"
);
const progress = document.getElementById("progress");
const volumeControl = document.getElementById("volume-control");
const volume = document.getElementById("volume");
const volumeIcon = document.getElementById("volume-icon");
const timeline = document.getElementById("timeline");

const onProfileClick = (event) => {
  event.stopPropagation();
  const userMenu = document.getElementById("user-profile-menu");
  const logOut = document.getElementById("logout");
  userMenu.classList.toggle("hidden");
  document
    .getElementById("user-profile-btn-toggle-icon")
    .classList.toggle("rotate-180");
  if (!userMenu.classList.contains("hidden")) {
    logOut.addEventListener("click", () => {
      LOGOUT();
    });
  } else {
  }
};

const onPlaylistItemsClick = (event, id) => {
  const section = SECTIONS.PLAYLIST;
  history.pushState(section, "", `/playlist/${id}`);
  loadSection(section, id);
};

const loadUserProfile = async () => {
  const userProfileBtn = document.getElementById("user-profile-btn");
  const userImage = document.getElementById("user-image");
  const userName = document.getElementById("user-name");
  const defaultImage = document.getElementById("default-image");

  const { display_name: displayName, images } = await fetchRequest(
    ENDPOINT.userInfo
  );

  if (images?.length) {
    defaultImage.classList.add("hidden");
    userImage.innerHTML = `<img src="${images[0].url}" alt="userImage" class="h-8 w-8 rounded-full"/>`;
  } else {
    defaultImage.classList.remove("hidden");
  }

  userName.textContent = displayName;

  userProfileBtn.addEventListener("click", onProfileClick);
};

const greeting = () => {
  const hour = new Date();
  const greeting = document.getElementById("greeting");
  if (hour.getHours() > 5 && hour.getHours() < 12) {
    greeting.textContent = `Good Morning`;
  } else if (hour.getHours() > 12 && hour.getHours() < 16) {
    greeting.textContent = `Good Afternoon`;
  } else {
    greeting.textContent = `Good Evening`;
  }
};

const loadPlaylist = async (endpoint, id) => {
  const playlist = document.getElementById(id);
  const {
    playlists: { items },
  } = await fetchRequest(endpoint);

  for (const { name, description, images, id } of items) {
    const playlistItems = document.createElement("section");
    playlistItems.id = id;
    playlistItems.setAttribute("data-type", "playlist");
    playlistItems.className =
      "  p-4 rounded-md bg-gray-900 hover:bg-gray-800 transition-colors duration-500 cursor-pointer";
    playlistItems.addEventListener("click", (event) =>
      onPlaylistItemsClick(event, id)
    );
    const [{ url: imageUrl }] = images;
    playlistItems.innerHTML = `<img class="rounded-md mb-4 " src="${imageUrl}" alt="${name}">
    <h3 class="text-sl mb-2 truncate">${name}</h3>
    <p class="text-sm line-clamp-2">${description}</p>`;

    playlist.appendChild(playlistItems);
  }
};

const callPlaylists = () => {
  loadPlaylist(ENDPOINT.featuredPlaylists, "featured-playlists");
  loadPlaylist(ENDPOINT.topPlaylists, "top-playlists");
};

const loadContentToDashboard = () => {
  const content = document.getElementById("content");
  const playlistMap = new Map([
    ["featured-playlists", "Featured"],
    ["top-playlists", "Top"],
  ]);

  let innerHtml = "";
  for (const [id, name] of playlistMap) {
    innerHtml += `<h2 class="mt-4 text-xl font-bold px-7">${name}</h2>
    <section
      class="grid grid-cols-auto-fill-cards gap-5 py-4 px-7"
      id="${id}"
    ></section>`;
  }
  content.innerHTML = innerHtml;
};

dashboard.addEventListener("scroll", () => {
  const dashboard = document.getElementById("dashboard");
  const navbar = document.getElementById("navbar");
  if (dashboard.scrollTop <= 200) {
    navbar.style.backgroundColor = `rgba(75,85,99,${
      dashboard.scrollTop / 200
    })`;
  } else {
    navbar.style.backgroundColor = `rgba(75,85,99,1)`;
  }
});

document.addEventListener("click", () => {
  const userMenu = document.getElementById("user-profile-menu");
  if (!userMenu.classList.contains("hidden")) {
    userMenu.classList.add("hidden");
    document
      .getElementById("user-profile-btn-toggle-icon")
      .classList.toggle("rotate-180");
  }
});

const loadHeaderofPlaylistItems = () => {
  const content = document.getElementById("content");
  const navbar = document.getElementById("navbar");
  const header = document.createElement("header");
  header.className = `sticky top-[64px] px-[1.8rem]`;
  header.innerHTML = `<ul class="grid grid-cols-[50px_2fr_1fr_50px] py-1">
    <li>#</li>
    <li>TITLE</li>
    <li>ALBUM</li>
    <li>
      <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </li>
</ul>

`;

  content.appendChild(header);
  stickyHeaderOnScroll(header);
};

const stickyHeaderOnScroll = (header) => {
  const dashboard = document.getElementById("dashboard");
  dashboard.addEventListener("scroll", () => {
    if (dashboard.scrollTop >= 240) {
      header.classList.add("bg-gray-800");
    } else {
      header.classList.remove("bg-gray-800");
    }
  });
};

const loadHeaderOfPlaylistPage = (name, description, image) => {
  const header = document.getElementById("greeting-section");

  header.innerHTML = `
  <img src="${image}" alt="playlist Logo" class="w-52 rounded-lg shadow-2xl"/>
  <span class="display flex flex-col mx-5 gap-4">
    <h1 class="text-6xl">${name}</h1>
    <p class ="text-lg">${description}</p>
  <span>
  `;
};

const loadUserPlaylist = async () => {
  const playlist = await fetchRequest(`${ENDPOINT.userPlaylist}`);
  const { items } = playlist;
  const userPlaylist = document.getElementById("user-playlist");

  for (const item of items) {
    let { name, id } = item;
    const userPlaylistItem = document.createElement("li");
    userPlaylistItem.id = id;
    userPlaylistItem.textContent = name;
    userPlaylistItem.className =
      "cursor-pointer p-2 text-slate-300 transition duration-300 hover:text-white";

    userPlaylistItem.addEventListener("click", (event) =>
      OnUserPlaylistClick(event, id)
    );
    userPlaylist.appendChild(userPlaylistItem);
  }
  console.log(playlist);
};

const OnUserPlaylistClick = (event, id) => {
  const section = SECTIONS.PLAYLIST;
  history.pushState(section, "", `/playlist/${id}`);
  loadSection(section, id);
};

const loadPlaylistItemsPage = async (id) => {
  const playlist = await fetchRequest(`${ENDPOINT.playlistItems}/${id}`);

  const { images, name, description } = playlist;
  const [image] = images;

  loadHeaderOfPlaylistPage(name, description, image.url);

  loadPlaylistItems(playlist);
};

const durationformatting = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const loadPlaylistItems = async ({ tracks }) => {
  const content = document.getElementById("content");
  const playlistItems = document.createElement("section");
  playlistItems.id = "playlist-items";
  let itemNo = 1;

  content.innerHTML = "";

  loadHeaderofPlaylistItems();

  for (let item of tracks.items.filter((item) => item.track.preview_url)) {
    let { id, name, duration_ms, album, artists, preview_url } = item.track;
    let duration = durationformatting(duration_ms);
    let image = album.images[2];

    let track = document.createElement("ul");
    track.id = id;
    let artistName = Array.from(artists, (artist) => artist.name).join(",");
    track.className =
      "cursor-pointer text-slate-400 grid grid-cols-[50px_2fr_1fr_50px] py-2 px-7 hover:text-white ";
    track.innerHTML = `
    <li>${itemNo++}</li>
    <li class="flex gap-2"><img class="h-10 w-10 " src="${
      image.url
    }" alt="${name}"/><span><h2 class="truncate pr-8 line-clamp-1 text-lg text-white hover:underline">${name}</h2><p class="text-sm hover:underline">${artistName}<p><span></li>
    <li class="truncate line-clamp-1 pr-8 hover:underline">${album.name}</li>
    <li>${duration}</li>
  `;
    playlistItems.appendChild(track);
    const imageUrl = image.url;
    trackList.push({
      id,
      name,
      duration_ms,
      imageUrl,
      artistName,
      preview_url,
    });
    track.addEventListener("click", (event) =>
      onTrackClick(
        event,
        id,
        preview_url,
        name,
        duration_ms,
        artistName,
        image.url,
        trackList
      )
    );
  }
  content.appendChild(playlistItems);
};

const onTrackClick = (
  event,
  id,
  trackUrl,
  name,
  duration,
  artists,
  image,
  trackList
) => {
  const songImage = document.getElementById("now-playing-image");
  const songTitle = document.getElementById("now-playing-song");
  const songArtist = document.getElementById("now-playing-artists");
  const songInfo = document.getElementById("song-info");
  const totalSongDuration = document.getElementById("total-song-duration");

  songImage.src = image;
  songTitle.textContent = name;
  songArtist.textContent = artists;
  songInfo.classList.remove("invisible");
  audio.src = trackUrl;
  let currentIndex = trackList.findIndex((element) => element.id === id);

  next.addEventListener("click", () => {
    let nextIndex = ++currentIndex;
    if (nextIndex >= trackList.length) {
      currentIndex = trackList.length - 2;
    }
    if (nextIndex < trackList.length && nextIndex >= 0) {
      songImage.src = trackList[nextIndex].imageUrl;
      songTitle.textContent = trackList[nextIndex].name;
      songArtist.textContent = trackList[nextIndex].artistName;
      songInfo.classList.remove("invisible");
      audio.src = trackList[nextIndex].preview_url;
      audio.play();
    }
  });

  previous.addEventListener("click", () => {
    let previousIndex = --currentIndex;
    if (previousIndex < 0) {
      currentIndex = 0;
    }

    if (previousIndex >= 0 && previousIndex < trackList.length) {
      songImage.src = trackList[previousIndex].imageUrl;
      songTitle.textContent = trackList[previousIndex].name;
      songArtist.textContent = trackList[previousIndex].artistName;
      songInfo.classList.remove("invisible");
      audio.src = trackList[previousIndex].preview_url;
      audio.play();
    }
  });

  audio.play();
  totalSongDuration.textContent = "0:30";
  play.innerHTML =
    '<span class="material-symbols-outlined" style="font-size: 40px">pause_circle</span>';

  setInterval(() => {
    if (audio.paused) {
      return;
    }
    songDurationCompleted.textContent = `0:${
      audio.currentTime.toFixed(0) < 10
        ? `0${audio.currentTime.toFixed(0)}`
        : `${audio.currentTime.toFixed(0)}`
    }`;
    progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  }, 100);
};

volume.addEventListener("change", () => {
  if (volume.value > 30) {
    volumeIcon.textContent = "volume_up";
  } else if (volume.value > 0 && volume.value < 30) {
    volumeIcon.textContent = "volume_down";
  } else {
    volumeIcon.textContent = "volume_mute";
  }
  audio.volume = volume.value / 100;
});

timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
    progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  },
  false
);

play.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    play.innerHTML =
      '<span class="material-symbols-outlined" style="font-size: 40px">pause_circle</span>';
  } else {
    play.innerHTML =
      '<span class="material-symbols-outlined" style="font-size: 40px">play_circle</span>';
    audio.pause();
  }
});

const loadSection = (section, id) => {
  if (section === "dashboard") {
    loadContentToDashboard();
    callPlaylists();
  } else {
    loadPlaylistItemsPage(id);
  }
};

window.addEventListener("popstate", (event) => {
  loadSection(event.state);
});

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  const section = SECTIONS.DASHBOARD;
  history.pushState(section, "", "");
  loadSection(section);
  greeting();
  loadUserPlaylist();
});
