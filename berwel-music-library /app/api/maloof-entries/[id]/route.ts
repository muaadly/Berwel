import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("API received ID:", id);
    const csvPath = path.join(process.cwd(), 'public', 'MaloofEntries', 'Maloof Entries.csv');
    const file = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(file, { header: true });
    const allEntries = parsed.data;

    console.log("Parsing CSV, data length:", allEntries.length);
    const entry = allEntries.find((row: any) => {
      const entryNumber = String(row['Entry Number']).trim();
      console.log("Checking row with trimmed Entry Number:", entryNumber);
      return entryNumber === id.trim();
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
    }

    const e = entry as any;

    // Filter for similar entries by Entry Type (excluding the current entry)
    const similarEntries = allEntries
      .filter((row: any) => String(row['Entry Number']).trim() !== id.trim() && row['Entry Type'] === e['Entry Type'])
      .map((row: any) => ({
        id: row['Entry Number'] || '',
        entryName: row['Entry Name'] || '',
        entryType: row['Entry Type'] || '',
        entryRhythm: row['Entry Rhythm'] || '',
        // Include Type Entry Image for similar entries
        image: row['Type Entry Image'] ? `/R_Images/Entry Images/${row['Type Entry Image'].replace(/\.[^/.]+$/, ".jpeg")}` : "", // Assuming .jpeg for similar entry images
      }));

    const returnedEntry = {
      id: e['Entry Number'] || '',
      entryName: e['Entry Name'] || '',
      entryType: e['Entry Type'] || '',
      entryRhythm: e['Entry Rhythm'] || '',
      composer: e['Composer'] || 'Unknown',
      origin: e['Origin'] || 'Unknown',
      period: e['Period'] || 'Unknown',
      recordingStatus: e['Recording Status'] || 'Unknown',
      soundCloudLink: e['SoundCloud Link'] || '',
      views: parseInt(e['Views'] || '0', 10),
      likes: parseInt(e['Likes'] || '0', 10),
      image: e['Entry Image'] || '',
      entryImage: (() => {
        const typeImageName = e['Type Entry Image'];
        if (!typeImageName) return "";
        const imageMap: { [key: string]: string } = {
          'ISB.PNG': 'ISB.jpeg',
          'RSD.PNG': 'RSD.jpeg',
          'SKA.PNG': 'SKA.png',
          'MHS.PNG': 'MHR.jpeg',
          'NWA.PNG': 'NWA.jpeg',
          'HSN.PNG': 'HSN.jpeg',
        };
        const imageName = imageMap[typeImageName.toUpperCase()] || typeImageName;
        const fileExtension = imageName.split('.').pop() || '';
        const baseName = imageName.replace(/\.[^/.]+$/, '');
        
        const finalImageName = imageMap[typeImageName.toUpperCase()] ? imageName : `${baseName}.jpeg`;

        return `/R_Images/Entry Images/${finalImageName}`;
      })(),
      noteImage: e['Note Image Name'] ? `/R_Images/Notes Images/${e['Note Image Name'].replace(/\.[^/.]+$/, ".png")}` : "",
      lyrics: e['Entry Lyrics'] || 'No lyrics available.',
      notes: e['Notes'] || 'No notes available.',
      comments: [],
    };
    console.log("API returning entry data:", returnedEntry);
    console.log("API returning noteImage path:", returnedEntry.noteImage);
    return NextResponse.json({ entry: returnedEntry, similarEntries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load entry.' }, { status: 500 });
  }
} 