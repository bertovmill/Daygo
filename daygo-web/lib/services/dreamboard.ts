import { supabase } from '../supabase'
import type { DreamboardImage } from '../types/database'

export const dreamboardService = {
  async getImages(userId: string): Promise<DreamboardImage[]> {
    const { data, error } = await supabase
      .from('dreamboard_images')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return (data as DreamboardImage[]) ?? []
  },

  async addImage(
    userId: string,
    imageFile: File,
    caption?: string
  ): Promise<DreamboardImage> {
    const imageUrl = await this.uploadImage(userId, imageFile)

    const { data, error } = await supabase
      .from('dreamboard_images')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        caption: caption || null,
      } as any)
      .select()
      .single()

    if (error) throw error
    return data as DreamboardImage
  },

  async updateImage(
    id: string,
    userId: string,
    updates: { caption?: string | null; sort_order?: number }
  ): Promise<DreamboardImage> {
    const { data, error } = await (supabase
      .from('dreamboard_images') as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data as DreamboardImage
  },

  async deleteImage(id: string, userId: string): Promise<void> {
    const { data: current } = await supabase
      .from('dreamboard_images')
      .select('image_url')
      .eq('id', id)
      .single()

    const typedCurrent = current as { image_url: string } | null
    if (typedCurrent?.image_url) {
      await this.deleteImageFromStorage(userId, typedCurrent.image_url)
    }

    const { error } = await (supabase
      .from('dreamboard_images') as any)
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadImage(userId: string, file: File): Promise<string> {
    let fileExt = file.name.split('.').pop()
    if (!fileExt || fileExt === file.name) {
      const mimeToExt: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/webp': 'webp',
      }
      fileExt = mimeToExt[file.type] || 'png'
    }

    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('dreamboard')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('dreamboard')
      .getPublicUrl(filePath)

    return publicUrl
  },

  async deleteImageFromStorage(userId: string, imageUrl: string): Promise<void> {
    const fileName = imageUrl.split('/').pop()
    if (fileName) {
      await supabase.storage
        .from('dreamboard')
        .remove([`${userId}/${fileName}`])
    }
  },
}
