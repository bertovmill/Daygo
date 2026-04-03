'use client'

import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/auth-store'
import { dreamboardService } from '@/lib/services/dreamboard'
import type { DreamboardImage } from '@/lib/types/database'
import { Plus, X, Loader2, ImageIcon, Pencil, Check } from 'lucide-react'

export default function DreamboardPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const [selectedImage, setSelectedImage] = useState<DreamboardImage | null>(null)

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['dreamboard', user?.id],
    queryFn: () => dreamboardService.getImages(user!.id),
    enabled: !!user,
  })

  const addMutation = useMutation({
    mutationFn: ({ file, caption }: { file: File; caption?: string }) =>
      dreamboardService.addImage(user!.id, file, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamboard', user?.id] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, caption }: { id: string; caption: string }) =>
      dreamboardService.updateImage(id, user!.id, { caption }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamboard', user?.id] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dreamboardService.deleteImage(id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamboard', user?.id] })
      setSelectedImage(null)
    },
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        if (file.size > 10 * 1024 * 1024) {
          alert('Image must be under 10MB')
          continue
        }
        await addMutation.mutateAsync({ file })
      }
    } catch {
      alert('Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const startEditCaption = (img: DreamboardImage) => {
    setEditingId(img.id)
    setEditCaption(img.caption || '')
  }

  const saveCaption = (id: string) => {
    updateMutation.mutate({ id, caption: editCaption })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-bevel-text dark:text-white">
            Dreamboard
          </h1>
          <p className="text-sm text-bevel-text-secondary dark:text-slate-400 mt-1">
            Visualize the life you&apos;re building
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-3 text-bevel-text-secondary dark:text-slate-400 hover:border-accent/50 hover:text-accent transition-colors"
        >
          <ImageIcon className="w-12 h-12" />
          <span className="text-sm font-medium">
            Upload photos of your dreams and aspirations
          </span>
        </button>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="break-inside-avoid group relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.image_url}
                alt={img.caption || 'Dream'}
                className="w-full object-cover"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  {editingId === img.id ? (
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Add a caption..."
                        className="flex-1 px-2 py-1 text-sm bg-white/90 dark:bg-slate-800/90 rounded-lg text-bevel-text dark:text-white"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveCaption(img.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                      />
                      <button
                        onClick={() => saveCaption(img.id)}
                        className="p-1 bg-accent rounded-lg text-white"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm font-medium truncate">
                        {img.caption || ''}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditCaption(img)
                        }}
                        className="p-1 text-white/80 hover:text-white"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image_url}
              alt={selectedImage.caption || 'Dream'}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {selectedImage.caption && (
              <p className="text-white text-center mt-4 text-lg font-medium">
                {selectedImage.caption}
              </p>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => {
                  if (confirm('Remove this image from your dreamboard?')) {
                    deleteMutation.mutate(selectedImage.id)
                  }
                }}
                className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
