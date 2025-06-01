import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const csvPath = path.join(process.cwd(), 'public', 'LibyanSongs', 'Libyan Songs.csv');
    const file = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(file, { header: true });
    const allSongs = parsed.data;

    const song = allSongs.find((row: any) => String(row['Song Number']) === id);

    if (!song) {
      return NextResponse.json({ error: 'Song not found.' }, { status: 404 });
    }

    const s = song as any;

    // Filter for similar songs by category (excluding the current song)
    const similarSongs = allSongs
      .filter((row: any) => String(row['Song Number']) !== id && row['Category'] === s['Category'])
      .map((row: any) => ({
        id: row['Song Number'] || '',
        songName: row['Song Name'] || '',
        singerName: row['Singer'] || '',
        views: parseInt(row['Views'] || '0', 10), // Assuming views are in the CSV and are numbers
        likes: parseInt(row['Likes'] || '0', 10), // Added likes property for similar songs
        image: row['Image Name'] || '', // Include imageName for similar songs
      }));

    return NextResponse.json({
      song: {
        number: s['Song Number'],
        name: s['Song Name'],
        singer: s['Singer'],
        imageName: s['Image Name'],
        category: s['Category'],
        lyricsStatus: s['Lyrics Status'],
        writer: s['Writer'],
        composer: s['Composer'],
        year: s['Year'],
        recordingStatus: s['Recording Status'],
        soundCloudLink: s['SoundCloud Link'],
        lyrics: s['Lyrics'],
        // Add other properties if needed for the main song details
        views: parseInt(s['Views'] || '0', 10), // Assuming views are in the CSV
        likes: parseInt(s['Likes'] || '0', 10), // Assuming likes are in the CSV
      },
      similarSongs,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load song.' }, { status: 500 });
  }
} 