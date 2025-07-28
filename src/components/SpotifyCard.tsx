import { useEffect, useState } from 'react';

export function SpotifyCard() {
  const [track, setTrack] = useState<any>(null);

  const fetchTrack = async () => {
    const res = await fetch('/api/now-playing');
    const data = await res.json();
    setTrack(data);
  };

  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!track || !track.isPlaying) return <div className="card">Not Playing</div>;

  return (
    <div className="card">
      <a href={track.songUrl} target="_blank" rel="noopener noreferrer">
        <img src={track.albumImageUrl} alt="Album Cover" />
        <h2>{track.title}</h2>
        <p>{track.artist}</p>
        <p><small>{track.album}</small></p>
      </a>
    </div>
  );
}
