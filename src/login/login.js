import { ACCESS_TOKEN,TOKEN_TYPE,EXPIRES_IN } from "../comman.js";

const clientId = import.meta.env.VITE_CLIENT_ID;
const scopes =
  "user-top-read user-follow-read playlist-read-private user-library-read";
const appUrl = import.meta.env.VITE_APP_URL;

function createPopupWin(pageURL, pageTitle, popupWinWidth, popupWinHeight) {
  let left = (screen.width - popupWinWidth) / 2;
  let top = (screen.height - popupWinHeight) / 4;
  window.open(
    pageURL,
    pageTitle,
    "resizable=yes, width=" +
      popupWinWidth +
      ", height=" +
      popupWinHeight +
      ", top=" +
      top +
      ", left=" +
      left
  );
}

const authorizeUser = () => {
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes}&redirect_uri=${appUrl}login/login.html&show_dialog=true`;

  // window.open(url, "login", "width = 500px ,height= 600px");
  createPopupWin(url, "login", 500, 600);
};

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("main-login");
  loginButton.addEventListener("click", authorizeUser);
});

window.setItemsInLocalStorage = (accessToken, tokenType, expiresIn) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_TYPE, tokenType);
  localStorage.setItem(EXPIRES_IN, expiresIn);
  window.location.reload();
};

window.addEventListener("load", () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  if (accessToken) {
    window.location.href = `${appUrl}dashboard/dashboard.html`;
  }

  if (window.opener !== null && !window.opener.closed) {
    window.focus();
    if (window.location.href.includes("error")) {
      window.close();
    }

    const { hash } = window.location;
    const searchparams = new URLSearchParams(hash);
    const accessToken = searchparams.get("#access_token");
    const tokenType = searchparams.get("token_type");
    const expiresIn = searchparams.get("expires_in");

    if (accessToken) {
      window.close();
      window.opener.setItemsInLocalStorage(accessToken, tokenType, expiresIn);
    } else {
      window.close();
    }
  }
});
