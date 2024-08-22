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

export interface Track {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: { spotify: string };
    href: string;
    id: string;
    images: { url: string; height: number; width: number }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: { reason: string };
    type: string;
    uri: string;
    artists: {
      external_urls: { spotify: string };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
  };
  artists: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string; ean: string; upc: string };
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: {};
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
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
        limit: 50,
      },
    });
    return response.data.artists.items;
  } catch (err: any | AxiosError) {
    throw err;
  }
}

export async function getArtist(
  accessToken: string,
  artistID: string
): Promise<Artist> {
  try {
    const response = await axios.get(
      SPOTIFY_API_ROOT_URL + "/artists/" + artistID,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    return response.data;
  } catch (err: any | AxiosError) {
    throw err;
  }
}

export async function getSavedTracksFromArtist(
  accessToken: string,
  artistID: string
): Promise<Track[]> {
  interface ResponseData {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: { added_at: string; track: Track }[];
  }
  // get user saved tracks (from URI)
  let response = await axios.get(SPOTIFY_API_ROOT_URL + "/me/tracks", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    params: {
      limit: 50,
    },
  });
  let data: ResponseData = response.data;
  let tracks: Track[] = [];
  data.items.forEach((item) => {
    let ids = [];
    for (let artist of item.track.artists) {
      if (artist.id === artistID) {
        ids.push(item.track.id);
        tracks.push(item.track);
      }
    }
  });

  while (data.next) {
    response = await axios.get(data.next, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    data = response.data;
    data.items.forEach((item) => {
      for (let artist of item.track.artists) {
        let ids = [];
        if (artist.id === artistID) {
          ids.push(item.track.id);
          tracks.push(item.track);
        }
      }
    });
  }

  return tracks;
}

export async function removeTracks(accessToken: string, tracks: Track[]) {
  const ids = [];
  for (let track of tracks) {
    ids.push(track.id);
  }
  await axios.delete(SPOTIFY_API_ROOT_URL + "/me/tracks", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    data: {
      ids: ids,
    },
  });
}
