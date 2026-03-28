import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use an untyped client so we can access the new table before regenerating DB types
const client = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
})

export interface ScratchpadBlock {
  id: string
  start: number
  end: number
  text: string
}

export const scratchpadBlocksService = {
  async getBlocks(userId: string, date: string): Promise<ScratchpadBlock[]> {
    const { data, error } = await client
      .from('scratchpad_blocks')
      .select('blocks')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return (data?.blocks as ScratchpadBlock[]) ?? []
  },

  async saveBlocks(userId: string, date: string, blocks: ScratchpadBlock[]): Promise<void> {
    const { error } = await client
      .from('scratchpad_blocks')
      .upsert(
        {
          user_id: userId,
          date,
          blocks: JSON.parse(JSON.stringify(blocks)),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,date' }
      )

    if (error) throw error
  },
}
