export const ACCESS_TOKEN = "accessToken";
export const TOKEN_TYPE = "tokenType";
export const EXPIRES_IN = "expiresIn";

const appUrl = import.meta.env.VITE_APP_URL;

export const ENDPOINT = {
  userInfo: "me",
  featuredPlaylists: "browse/featured-playlists?limit=6",
  topPlaylists: "browse/categories/toplists/playlists?limit=12",
  playlistItems: "playlists",
};

export const LOGOUT = () => {
  localStorage.clear();
  window.location.href = appUrl;
};

export const SECTIONS = {
  DASHBOARD: "dashboard",
  PLAYLIST: "/playlist",
};
