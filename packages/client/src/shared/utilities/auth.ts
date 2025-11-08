import api from "../utilities/axiosConfig";


let accessToken: string | null = null;

const tokenFromStorage = localStorage.getItem("accessToken");
if (tokenFromStorage) accessToken = tokenFromStorage;

export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => accessToken;

export const fetchWithAuth = async (url: string) => {
  try {
    const res = await api.get(url);
    return res;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const refreshed = await api.post("/refresh-token");
      setAccessToken(refreshed.data.accessToken);
      const retry = await api.get(url);
      return retry;
    } else {
      console.error("Refresh token error", err);
    }
  }
};

export const postWithAuth = async (url: string, data: any) => {
  try {
    const res = await api.post(url, data);
    return res;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const refreshed = await api.post("/refresh-token");
      setAccessToken(refreshed.data.accessToken);
      const retry = await api.post(url, data);
      return retry;
    } else {
      console.error("Refresh Token Error.", err);
    }
  }
};
