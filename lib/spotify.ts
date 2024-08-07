import axios, { AxiosError } from "axios";

const SPOTIFY_API_ROOT_URL = "https://api.spotify.com/v1";

export interface Artist {
  external_urls: { spotify: string }[];
  followers: { href: string; total: number };
  genres: string[];
  href: string;
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

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

export async function searchArtist(
  accessToken: string,
  artist: string
): Promise<Artist[]> {
  try {
    const response = await axios.get(SPOTIFY_API_ROOT_URL + "/search", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        query: encodeURI(artist),
        type: "artist",
        limit: 10,
      },
    });
    return response.data.artists.items;
  } catch (err: any | AxiosError) {
    throw err;
  }
}