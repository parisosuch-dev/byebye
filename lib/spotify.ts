import axios from "axios";

export async function getProfile(accessToken: string) {
  const response = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  return response.data;
}
