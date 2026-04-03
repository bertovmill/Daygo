'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dreamboardService } from '@/lib/services/dreamboard'
import type { DreamboardImage } from '@/lib/types/database'
import { Plus, X, Loader2, Pencil, Check, ChevronUp, ChevronDown, Sparkles, Clipboard } from 'lucide-react'

interface DreamboardSectionProps {
  userId: string
  expanded: boolean
  onToggle: () => void
}

export function DreamboardSection({ userId, expanded, onToggle }: DreamboardSectionProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const [selectedImage, setSelectedImage] = useState<DreamboardImage | null>(null)
  const [pasteHint, setPasteHint] = useState(false)

  const { data: images = [] } = useQuery({
    queryKey: ['dreamboard', userId],
    queryFn: () => dreamboardService.getImages(userId),
    enabled: !!userId,
  })

  const addMutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      dreamboardService.addImage(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamboard', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, caption }: { id: string; caption: string }) =>
      dreamboardService.updateImage(id, userId, { caption }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamboard', userId] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dreamboardService.deleteImage(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamboard', userId] })
      setSelectedImage(null)
    },
  })

  const uploadFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(
      (f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
    )
    if (!imageFiles.length) return

    setUploading(true)
    try {
      for (const file of imageFiles) {
        await addMutation.mutateAsync({ file })
      }
    } catch {
      // silently fail
    } finally {
      setUploading(false)
    }
  }, [addMutation])

  // Global paste listener
  useEffect(() => {
    if (!expanded) return

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const imageFiles: File[] = []
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) imageFiles.push(file)
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault()
        uploadFiles(imageFiles)
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [expanded, uploadFiles])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    await uploadFiles(Array.from(files))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const startEditCaption = (img: DreamboardImage) => {
    setEditingId(img.id)
    setEditCaption(img.caption || '')
  }

  const saveCaption = (id: string) => {
    updateMutation.mutate({ id, caption: editCaption })
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="rounded-2xl p-4 -mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4.5 h-4.5 text-purple-500" />
            <h2 className="section-header text-bevel-text-secondary dark:text-slate-400">
              Dreamboard{images.length > 0 && <span className="text-purple-500"> ({images.length})</span>}
            </h2>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-bevel-text-secondary group-hover:text-bevel-text dark:group-hover:text-slate-300 transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-bevel-text-secondary group-hover:text-bevel-text dark:group-hover:text-slate-300 transition-colors" />
            )}
          </button>
          {expanded && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              Add
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {expanded && (
          <>
            {images.length === 0 ? (
              <div
                onMouseEnter={() => setPasteHint(true)}
                onMouseLeave={() => setPasteHint(false)}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 border-2 border-dashed border-purple-200/60 dark:border-purple-500/20 rounded-2xl flex flex-col items-center gap-3 text-bevel-text-secondary dark:text-slate-400 hover:border-purple-400/60 hover:text-purple-500 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-purple-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-bevel-text dark:text-slate-300">
                    Add photos of your dreams
                  </p>
                  <p className="text-xs mt-1 text-bevel-text-secondary dark:text-slate-500">
                    Click to upload or <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-mono shadow-sm border border-slate-200 dark:border-slate-600">&#8984;V</kbd> to paste
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Masonry grid */}
                <div className="columns-2 md:columns-3 gap-3 space-y-3">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption || 'Dream'}
                        className="w-full object-cover"
                        loading="lazy"
                      />
                      {/* Caption bar always visible if caption exists */}
                      {img.caption && editingId !== img.id && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pt-8 pb-2.5 px-3">
                          <p className="text-white text-xs font-medium truncate drop-shadow-sm">
                            {img.caption}
                          </p>
                        </div>
                      )}
                      {/* Hover overlay for actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
                        <div className="absolute bottom-0 inset-x-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                          {editingId === img.id ? (
                            <div
                              className="flex gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                placeholder="Add a caption..."
                                className="flex-1 px-2.5 py-1.5 text-xs bg-white/95 dark:bg-slate-800/95 rounded-lg text-bevel-text dark:text-white backdrop-blur-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveCaption(img.id)
                                  if (e.key === 'Escape') setEditingId(null)
                                }}
                              />
                              <button
                                onClick={() => saveCaption(img.id)}
                                className="px-2 py-1.5 bg-purple-500 rounded-lg text-white"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditCaption(img)
                              }}
                              className="w-full flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-xs text-bevel-text dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                              {img.caption ? 'Edit caption' : 'Add caption'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paste hint */}
                <p className="text-center text-[11px] text-bevel-text-secondary/60 dark:text-slate-500/60">
                  <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono border border-slate-200/60 dark:border-slate-700/60">&#8984;V</kbd> to paste an image
                </p>
              </div>
            )}

            {/* Upload progress overlay */}
            {uploading && (
              <div className="mt-3 flex items-center justify-center gap-2 py-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Uploading...</span>
              </div>
            )}
          </>
        )}
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image_url}
              alt={selectedImage.caption || 'Dream'}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            {selectedImage.caption && (
              <p className="text-white/90 text-center mt-4 text-lg font-medium">
                {selectedImage.caption}
              </p>
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 left-3 p-2 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (confirm('Remove this image from your dreamboard?')) {
                  deleteMutation.mutate(selectedImage.id)
                }
              }}
              className="absolute top-3 right-3 p-2 bg-red-500/70 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
