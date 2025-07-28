import type { APIRoute } from "astro";
import axios from "axios";

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} = import.meta.env;

export const prerender = false;

export const GET: APIRoute = async () => {
  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    {
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token } = tokenResponse.data;

  const nowPlaying = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).catch(() => null);

  if (!nowPlaying?.data?.is_playing) {
    return new Response(JSON.stringify({ isPlaying: false }), { status: 200 });
  }

  const item = nowPlaying.data.item;

  return new Response(
    JSON.stringify({
      isPlaying: true,
      title: item.name,
      artist: item.artists.map((a: any) => a.name).join(", "),
      album: item.album.name,
      albumImageUrl: item.album.images[0].url,
      songUrl: item.external_urls.spotify,
    }),
    { status: 200 }
  );
};