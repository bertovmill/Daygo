'use client'

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Flame, ChevronDown, Check, X, Plus, Pencil, Trash2, Hash, BarChart3 } from 'lucide-react'
import { homeVisionsService, normalizePillarItems, type HomeVision, type HomeVisionPillar, type PillarItem } from '@/lib/services/homeVisions'
import { visionChecklistLogsService, type ChecklistState, type VisionChecklistLog } from '@/lib/services/visionChecklistLogs'
import confetti from 'canvas-confetti'

const PILLAR_COLORS = {
  emerald: {
    border: 'border-emerald-200/60 dark:border-emerald-500/20',
    hoverBg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5',
    gradient: 'from-emerald-400 to-teal-500',
    label: 'text-emerald-500 dark:text-emerald-400',
    tagline: 'text-emerald-600 dark:text-emerald-400',
    checkHover: 'group-hover:border-emerald-400',
    checked: 'bg-emerald-500 border-emerald-500',
    metricBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    metricRing: 'focus:ring-emerald-500/50',
  },
  sky: {
    border: 'border-sky-200/60 dark:border-sky-500/20',
    hoverBg: 'hover:bg-sky-50/50 dark:hover:bg-sky-500/5',
    gradient: 'from-sky-400 to-blue-500',
    label: 'text-sky-500 dark:text-sky-400',
    tagline: 'text-sky-600 dark:text-sky-400',
    checkHover: 'group-hover:border-sky-400',
    checked: 'bg-sky-500 border-sky-500',
    metricBg: 'bg-sky-50 dark:bg-sky-500/10',
    metricRing: 'focus:ring-sky-500/50',
  },
  purple: {
    border: 'border-purple-200/60 dark:border-purple-500/20',
    hoverBg: 'hover:bg-purple-50/50 dark:hover:bg-purple-500/5',
    gradient: 'from-purple-400 to-violet-500',
    label: 'text-purple-500 dark:text-purple-400',
    tagline: 'text-purple-600 dark:text-purple-400',
    checkHover: 'group-hover:border-purple-400',
    checked: 'bg-purple-500 border-purple-500',
    metricBg: 'bg-purple-50 dark:bg-purple-500/10',
    metricRing: 'focus:ring-purple-500/50',
  },
  amber: {
    border: 'border-amber-200/60 dark:border-amber-500/20',
    hoverBg: 'hover:bg-amber-50/50 dark:hover:bg-amber-500/5',
    gradient: 'from-amber-400 to-orange-500',
    label: 'text-amber-500 dark:text-amber-400',
    tagline: 'text-amber-600 dark:text-amber-400',
    checkHover: 'group-hover:border-amber-400',
    checked: 'bg-amber-500 border-amber-500',
    metricBg: 'bg-amber-50 dark:bg-amber-500/10',
    metricRing: 'focus:ring-amber-500/50',
  },
  rose: {
    border: 'border-rose-200/60 dark:border-rose-500/20',
    hoverBg: 'hover:bg-rose-50/50 dark:hover:bg-rose-500/5',
    gradient: 'from-rose-400 to-pink-500',
    label: 'text-rose-500 dark:text-rose-400',
    tagline: 'text-rose-600 dark:text-rose-400',
    checkHover: 'group-hover:border-rose-400',
    checked: 'bg-rose-500 border-rose-500',
    metricBg: 'bg-rose-50 dark:bg-rose-500/10',
    metricRing: 'focus:ring-rose-500/50',
  },
}

const COLOR_OPTIONS: { value: HomeVisionPillar['color']; label: string }[] = [
  { value: 'emerald', label: 'Green' },
  { value: 'sky', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'amber', label: 'Amber' },
  { value: 'rose', label: 'Rose' },
]

interface HomeVisionSectionProps {
  userId: string
  selectedDate: Date
}

function formatDate(d: Date) {
  return d.toISOString().split('T')[0]
}

export function HomeVisionSection({ userId, selectedDate }: HomeVisionSectionProps) {
  const queryClient = useQueryClient()
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    title: string
    subtitle: string
    pillars: HomeVisionPillar[]
  } | null>(null)

  const [showProgress, setShowProgress] = useState(false)
  const [progressRange, setProgressRange] = useState<'week' | 'month' | 'year'>('week')

  // Daily checklist state (Supabase)
  const dateKey = formatDate(selectedDate)
