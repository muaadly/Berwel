import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'LibyanSongs', 'Libyan Songs.csv');
    const file = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(file, { header: true });
    // Map to only the relevant columns for the frontend table
    const songs = parsed.data.map((row: any, idx: number) => ({
      number: row['Song Number'] || idx + 1,
      name: row['Song Name'] || '',
      singer: row['Singer'] || '',
      category: row['Category'] || '',
      play: row['SoundCloud Link'] || '',
      imageName: row['Image Name'] || '',
      likes: 0,
    }));

    // Extract unique singers with their image names
    const singersMap = new Map<string, { name: string, imageName: string }>();
    songs.forEach(song => {
      if (song.singer && song.imageName && !singersMap.has(song.singer)) {
        singersMap.set(song.singer, { name: song.singer, imageName: song.imageName });
      }
    });
    const uniqueSingers = Array.from(singersMap.values());

    // Extract unique categories
    const uniqueCategories = Array.from(new Set(songs.map(song => song.category).filter(category => category !== '')));

    return NextResponse.json({ songs, uniqueSingers, uniqueCategories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load songs.' }, { status: 500 });
  }
} 