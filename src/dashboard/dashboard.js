import { fetchRequest } from "../api";
import { ENDPOINT, LOGOUT } from "../comman";

const onProfileClick = (event) => {
  event.stopPropagation();
  const userMenu = document.getElementById("user-profile-menu");
  const logOut = document.getElementById("logout");
  userMenu.classList.toggle("hidden");
  if (!userMenu.classList.contains("hidden")) {
    logOut.addEventListener("click", () => {
      LOGOUT();
    });
  }
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

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();

  document.addEventListener("click", () => {
    const userMenu = document.getElementById("user-profile-menu");
    if (!userMenu.classList.contains("hidden")) {
      userMenu.classList.add("hidden");
    }
  });
});
