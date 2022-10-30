import { fetchRequest } from "../api";
import { ENDPOINT, LOGOUT, SECTIONS } from "../comman";

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
  if (dashboard.scrollTop <= 100) {
    navbar.style.backgroundColor = `rgba(75,85,99,${
      dashboard.scrollTop / 100
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

  header.className = `sticky top-[${navbar.offsetHeight}px] px-[1.8rem]`;
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
</ul>`;

  content.appendChild(header);
  stickyHeaderOnScroll(header);
};

const stickyHeaderOnScroll = (header) => {
  const dashboard = document.getElementById("dashboard");
  dashboard.addEventListener("scroll", () => {
    if (dashboard.scrollTop >= 161) {
      header.classList.add("bg-gray-800");
    } else {
      header.classList.remove("bg-gray-800");
    }
  });
};

const loadPlaylistItemsPage = async (id) => {
  const playlist = await fetchRequest(`${ENDPOINT.playlistItems}/${id}`);

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

  for (let item of tracks.items) {
    let { id, name, duration_ms, album, artists } = item.track;
    let duration = durationformatting(duration_ms);
    let image = album.images[2];

    playlistItems.innerHTML += `<ul id="${id}" class="cursor-pointer text-slate-600 grid grid-cols-[50px_2fr_1fr_50px] py-2 px-7 hover:text-white ">
    <li>${itemNo++}</li>
    <li class="flex gap-2"><img class="h-10 w-10 " src="${
      image.url
    }" alt="${name}"/><span><h2 class="truncate pr-8 text-lg text-white hover:underline">${name}</h2><p class="text-sm hover:underline">${Array.from(
      artists,
      (artist) => artist.name
    ).join(",")}<p><span></li>
    <li class="truncate pr-8 hover:underline">${album.name}</li>
    <li>${duration}</li>
  </ul>`;
  }
  content.appendChild(playlistItems);
};

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
});
