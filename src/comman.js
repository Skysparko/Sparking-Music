export const ACCESS_TOKEN = "accessToken";
export const TOKEN_TYPE = "tokenType";
export const EXPIRES_IN = "expiresIn";
export const NOW_PLAYING = "NOW_PLAYING";
export const LOADED_TRACKS = "LOADED_TRACKS";

const appUrl = import.meta.env.VITE_APP_URL;

export const ENDPOINT = {
  userInfo: "me",
  featuredPlaylists: "browse/featured-playlists?limit=6",
  topPlaylists: "browse/categories/toplists/playlists?limit=12",
  playlistItems: "playlists",
  userPlaylist: "me/playlists",
};

export const LOGOUT = () => {
  localStorage.clear();
  window.location.href = appUrl;
};

export const getItemFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
export const setItemInLocalStorage = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

export const SECTIONS = {
  DASHBOARD: "dashboard",
  PLAYLIST: "/playlist",
};
