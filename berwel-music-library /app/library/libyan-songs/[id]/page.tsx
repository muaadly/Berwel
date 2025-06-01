"use client"

import { use, useEffect, useState } from "react";
import { SongDetails } from "./song-details";

export default function LibyanSongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [song, setSong] = useState<any>(null);
  const [similarSongs, setSimilarSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/libyan-songs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data.song);
        setSimilarSongs(data.similarSongs);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load song.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading song...</div>;
  }

  if (error || !song) {
    return <div className="text-center py-8 text-red-500">{error || "Song not found."}</div>;
  }

  // Dynamically construct the singer image path
  const singerImage = song.imageName
    ? `/R_Images/Singers_Images/${song.imageName}`
    : "/placeholder.svg";

  // Pass all required fields to SongDetails
  const songDetails = {
    id: song.number || id,
    songName: song.name,
    singerName: song.singer,
    category: song.category,
    lyricsStatus: song.lyricsStatus,
    writer: song.writer,
    composer: song.composer,
    year: song.year,
    recordingStatus: song.recordingStatus,
    soundCloudLink: song.soundCloudLink,
    lyrics: song.lyrics,
    singerImage,
    // The following are now expected from the API
    views: song.views || 0,
    likes: song.likes || 0,
    image: song.imageName ? `/R_Images/Entry Images/${song.imageName.replace(/\.[^/.]+$/, ".jpeg")}` : "",
    sheetMusic: song.sheetMusic || "",
    notes: song.notes || "",
    comments: song.comments || [],
  };

  // Pass similarSongs to SongDetails
  return <SongDetails song={songDetails} similarSongs={similarSongs} />;
}
