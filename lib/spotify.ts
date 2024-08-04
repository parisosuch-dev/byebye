import axios from "axios";

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
