"use client"

import React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Eye, ExternalLink, User } from "lucide-react"
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from "@/components/enhanced-tabs"

interface Song {
  id: string
  songName: string
  singerName: string
  category: string
  lyricsStatus: string
  writer: string
  composer: string
  year: string
  recordingStatus: string
  soundCloudLink: string
  views: number
  likes: number
  image: string
  singerImage: string
  sheetMusic: string
  lyrics: string
  notes: string
  comments: Array<{
    user: string
    text: string
    date: string
    avatar: string | null
  }>
}

interface SimilarSong {
  id: string
  songName: string
  singerName: string
  views: number
  likes: number
  image: string
}

interface SongDetailsProps {
  song: Song
  similarSongs: SimilarSong[]
}

export function SongDetails({ song, similarSongs }: SongDetailsProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="mb-4 flex items-center gap-2">
            <Link href="/library" className="text-sm text-gray-400 hover:underline">
              Library
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/library/libyan-songs" className="text-sm text-gray-400 hover:underline">
              Libyan Songs
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium">{song.songName}</span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left column - Singer image */}
            <div className="md:col-span-1">
              <div className="overflow-hidden rounded-lg border-2 border-white">
                <Image
                  src={song.singerImage || "/placeholder.svg"}
                  alt={song.singerName}
                  width={400}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* Middle column - Song details */}
            <div className="md:col-span-2">
              <h1 className="mb-6 text-3xl font-bold">{song.songName}</h1>

              {/* Enhanced attributes section with borders */}
              <div className="mb-8 overflow-hidden rounded-lg border border-white/30 bg-gray-900/30">
                <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                  {/* First column */}
                  <div className="flex flex-col divide-y divide-white/10">
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Singer</p>
                      <p className="text-lg font-medium">{song.singerName}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Writer</p>
                      <p className="font-medium">{song.writer}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Recording Status</p>
                      <p className="font-medium">{song.recordingStatus}</p>
                    </div>
                  </div>

                  {/* Second column */}
                  <div className="flex flex-col divide-y divide-white/10">
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-medium">{song.category}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Composer</p>
                      <p className="font-medium">{song.composer}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">SoundCloud Link</p>
                      <a
                        href={song.soundCloudLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        <span className="truncate">Listen on SoundCloud</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Third column */}
                  <div className="flex flex-col divide-y divide-white/10">
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Lyrics Status</p>
                      <p className="font-medium">{song.lyricsStatus}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">Year</p>
                      <p className="font-medium">{song.year}</p>
                    </div>
                    <div className="p-4 sm:invisible">{/* Empty cell to maintain grid structure */}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap items-center gap-4">
                <Button
                  variant="outline"
                  className={`flex items-center gap-1 rounded-md border border-white/20 px-3 py-2 transition-colors hover:border-white/30 ${isLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-300"}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                  <span className="ml-1">{song.likes.toLocaleString()}</span>
                  <span className="sr-only">Like</span>
                </Button>

                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full text-gray-400">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>

              {/* Tabs section */}
              <EnhancedTabs defaultValue="lyrics" className="w-full">
                <EnhancedTabsList className="w-full border border-white/50 flex">
                  <EnhancedTabsTrigger value="lyrics" className="py-3 px-4 flex-1">
                    Lyrics
                  </EnhancedTabsTrigger>
                  <EnhancedTabsTrigger value="comments" className="py-3 px-4 flex-1">
                    Comments
                  </EnhancedTabsTrigger>
                </EnhancedTabsList>

                <EnhancedTabsContent value="lyrics" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
                  <div className="whitespace-pre-line text-right" dir="rtl">
                    {song.lyrics}
                  </div>
                </EnhancedTabsContent>

                <EnhancedTabsContent value="comments" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {song.comments && song.comments.length > 0 ? (
                        <div className="space-y-4">
                          {song.comments.map((comment, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="flex-shrink-0">
                                {comment.avatar ? (
                                  <Image
                                    src={comment.avatar || "/placeholder.svg"}
                                    alt={comment.user}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                                    <User className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 border-b border-white/10 pb-4 last:border-0">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-medium">{comment.user}</span>
                                  <span className="text-sm text-gray-400">{comment.date}</span>
                                </div>
                                <p className="text-gray-300">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No comments yet.</p>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="mb-4 text-lg font-medium">Add a Comment</h3>
                      <form className="space-y-4">
                        {/* Mock logged-in user profile */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                            <span className="text-sm font-bold text-black">JD</span>
                          </div>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-gray-400">Logged in via Google</p>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="comment-text" className="mb-2 block text-sm font-medium text-gray-300">
                            Comment
                          </label>
                          <textarea
                            id="comment-text"
                            rows={4}
                            className="w-full rounded-md border border-white/20 bg-gray-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                            placeholder="Share your thoughts about this song..."
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-600 focus:outline-none"
                        >
                          Post Comment
                        </button>
                      </form>
                    </div>
                  </div>
                </EnhancedTabsContent>
              </EnhancedTabs>
            </div>
          </div>

          {/* Similar Songs section */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Similar Songs</h2>
            {/* Adjusted grid for smaller boxes and more columns on larger screens */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {/* Limit to a maximum of 4 similar songs and map over them */}
              {similarSongs.slice(0, 4).map((similarSong) => (
                <Link
                  key={similarSong.id}
                  href={`/library/libyan-songs/${similarSong.id}`}
                  className="group rounded-lg border-2 border-white bg-gray-950 p-4 transition-colors hover:border-white/40 flex items-center gap-4"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    {/* Construct singer image path using imageName */}
                    <Image
                      src={similarSong.image ? `/R_Images/Singers_Images/${similarSong.image}` : "/placeholder.svg"}
                      alt={similarSong.singerName}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium group-hover:text-amber-500">{similarSong.songName}</h3>
                    <p className="text-sm text-gray-400">{similarSong.singerName}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      {/* Display likes count instead of views */}
                      <Heart className="h-3 w-3" />
                      <span>{similarSong.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 