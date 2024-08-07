import axios, { AxiosError } from "axios";

const SPOTIFY_API_ROOT_URL = "https://api.spotify.com/v1";

export async function getProfile(accessToken: string) {
  const response = await axios.get(SPOTIFY_API_ROOT_URL + "/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  return response.data;
}

export async function getPlaylists(accessToken: string) {
  const response = await axios.get(SPOTIFY_API_ROOT_URL + "/me/playlists", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  return response.data;
}

export async function getTracks(accessToken: string) {
  console.log(accessToken);
  try {
    const response = await axios.get(SPOTIFY_API_ROOT_URL + "/me/tracks", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        limit: 50,
      },
    });
    return response.data;
  } catch (err: any | AxiosError) {
    if (axios.isAxiosError(err)) {
      console.error(err.message);
      console.error(err.response);
    } else {
      console.error(err);
    }
  }
}
