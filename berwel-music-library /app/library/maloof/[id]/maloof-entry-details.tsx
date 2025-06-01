"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Eye, User } from "lucide-react"
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from "@/components/enhanced-tabs"

type MaloofEntry = {
  id: string
  entryName: string
  entryType: string
  entryRhythm: string
  composer: string
  origin: string
  period: string
  recordingStatus: string
  soundCloudLink: string
  views: number
  likes: number
  image: string
  entryImage: string
  noteImage: string
  lyrics: string
  notes: string
  comments: Array<{
    user: string
    text: string
    date: string
    avatar: string | null
  }>
}

type SimilarEntry = {
  id: string
  entryName: string
  entryType: string
  entryRhythm: string
  image: string
}

interface MaloofEntryDetailsProps {
  entry: MaloofEntry
  similarEntries: SimilarEntry[]
}

export function MaloofEntryDetails({ entry, similarEntries }: MaloofEntryDetailsProps) {
  console.log("MaloofEntryDetails received entry:", entry);
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/library" className="text-sm text-gray-400 hover:underline">
          Library
        </Link>
        <span className="text-gray-400">/</span>
        <Link href="/library?tab=maloof" className="text-sm text-gray-400 hover:underline">
          Maloof
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-sm font-medium">{entry.entryName}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-lg border-2 border-white">
            <Image
              src={entry.entryImage || "/placeholder.svg"}
              alt={entry.entryName}
              width={400}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="mb-6 text-3xl font-bold">{entry.entryName}</h1>

          <div className="mb-8 overflow-hidden rounded-lg border border-white/30 bg-gray-900/30">
            <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
              <div className="p-4">
                <p className="text-sm text-gray-400">Entry Type</p>
                <p className="text-lg font-medium">{entry.entryType}</p>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-400">Rhythm</p>
                <p className="font-medium">{entry.entryRhythm}</p>
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
              <span className="ml-1">{entry.likes.toLocaleString()}</span>
              <span className="sr-only">Like</span>
            </Button>

            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full text-gray-400">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <EnhancedTabs defaultValue="lyrics" className="w-full">
            <EnhancedTabsList className="w-full border border-white/50 flex">
              <EnhancedTabsTrigger value="lyrics" className="py-3 px-4 flex-1">
                Lyrics
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="notes" className="py-3 px-4 flex-1">
                Notes
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="comments" className="py-3 px-4 flex-1">
                Comments
              </EnhancedTabsTrigger>
            </EnhancedTabsList>

            <EnhancedTabsContent value="lyrics" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
              <div className="whitespace-pre-line text-right" dir="rtl">
                {entry.lyrics}
              </div>
            </EnhancedTabsContent>

            <EnhancedTabsContent value="notes" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
              {entry.noteImage ? (
                <Image
                  src={entry.noteImage}
                  alt={`${entry.entryName} Notes`}
                  width={600}
                  height={400}
                  className="w-full object-contain"
                />
              ) : (
                <p className="text-gray-400">No note image available.</p>
              )}
            </EnhancedTabsContent>

            <EnhancedTabsContent value="comments" className="mt-4 rounded-lg border-2 border-white bg-gray-950 p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  {entry.comments && entry.comments.length > 0 ? (
                    <div className="space-y-4">
                      {entry.comments.map((comment, index) => (
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
                        placeholder="Share your thoughts about this entry..."
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

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Similar Entries</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {similarEntries.slice(0, 4).map((similarEntry) => (
            <Link
              key={similarEntry.id}
              href={`/library/maloof/${similarEntry.id}`}
              className="group rounded-lg border-2 border-white bg-gray-950 p-4 transition-colors hover:border-white/40 flex flex-col items-center text-center"
            >
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md mb-2">
                <Image
                  src={similarEntry.image || "/placeholder.svg"}
                  alt={similarEntry.entryName}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-medium text-sm truncate group-hover:text-amber-500">{similarEntry.entryName}</h3>
                <p className="text-xs text-gray-400 truncate">{similarEntry.entryType}</p>
                <p className="text-xs text-gray-500 truncate">{similarEntry.entryRhythm}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 