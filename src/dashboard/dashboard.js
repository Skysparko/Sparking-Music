import { fetchRequest } from "../api";
import { ENDPOINT, LOGOUT } from "../comman";

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

const onPlaylistItemsClick = (event) => {
  console.log(event.target);
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
    playlistItems.addEventListener("click", onPlaylistItemsClick);
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
    innerHtml += `<h2 class="mt-4 text-xl font-bold">${name}</h2>
    <section
      class="grid grid-cols-auto-fill-cards gap-5 py-4"
      id="${id}"
    ></section>`;
  }
  content.innerHTML = innerHtml;
};

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadContentToDashboard();
  callPlaylists();
  document.addEventListener("click", () => {
    const userMenu = document.getElementById("user-profile-menu");
    if (!userMenu.classList.contains("hidden")) {
      userMenu.classList.add("hidden");
    }
  });
});
