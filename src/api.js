import { ACCESS_TOKEN, EXPIRES_IN, LOGOUT, TOKEN_TYPE } from "./comman";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

const getAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const tokenType = localStorage.getItem(TOKEN_TYPE);
  const expiresIn = localStorage.getItem(EXPIRES_IN);

  if (Date.now() < expiresIn) {
    return { accessToken, tokenType };
  } else {
    //logout
    LOGOUT();
  }
};

const createApiConfig = ({ accessToken, tokenType }, method = "GET") => {
  return {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    method,
  };
};

export const fetchRequest = async (endpoint) => {
  const url = `${BASE_API_URL}/${endpoint}`;
  const response = await fetch(url, createApiConfig(getAccessToken()));
  return response.json();
};
