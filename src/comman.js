export const ACCESS_TOKEN = "accessToken";
export const TOKEN_TYPE = "tokenType";
export const EXPIRES_IN = "expiresIn";

const appUrl = import.meta.env.VITE_APP_URL;

export const ENDPOINT = {
  userInfo: "me",
};

export const LOGOUT = () => {
  localStorage.clear();
  window.location.href = appUrl;
};
