'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreHorizontal, Check, X } from 'lucide-react'
import type { HabitWithLog } from '@/lib/types/database'
import confetti from 'canvas-confetti'

interface SortableHabitCardProps {
  habit: HabitWithLog
  onEdit?: (habit: HabitWithLog) => void
  onToggle?: (habitId: string, completed: boolean) => void
}

export function SortableHabitCard({ habit, onEdit, onToggle }: SortableHabitCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 150ms cubic-bezier(0.25, 1, 0.5, 1)',
  }

  const handleYes = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!habit.completed) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      confetti({ particleCount: 40, spread: 70, origin: { x, y }, startVelocity: 20, gravity: 0.8, scalar: 0.8, ticks: 60, colors: ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'] })
    }
    onToggle?.(habit.id, true)
  }

  const handleNo = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle?.(habit.id, false)
  }

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(habit)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-[1rem] px-2 py-2 transition-all duration-200 ${
        isDragging
          ? 'opacity-50 scale-[1.01] bg-white/60 dark:bg-slate-800/60'
          : habit.completed
            ? 'bg-white/45 dark:bg-slate-800/35'
            : 'shadow-bevel hover:shadow-bevel-md'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#e7dfd1]/50 dark:bg-slate-700/35" />
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-1 mt-0.5 text-bevel-text-secondary/80 dark:text-slate-500 hover:text-bevel-text dark:hover:text-slate-200 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className={`font-medium leading-snug text-[15px] ${
              habit.completed
                ? 'text-teal dark:text-teal-400'
                : 'text-bevel-text dark:text-white'
            }`}>
              {habit.name}
            </h3>
            <button
              onClick={handleOptionsClick}
              className="p-1 -m-0.5 hover:bg-gray-100/70 dark:hover:bg-slate-700/70 rounded-lg transition-colors flex-shrink-0"
              aria-label="Habit options"
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-bevel-text-secondary dark:text-slate-400" />
            </button>
          </div>

          {habit.description && (
            <p className="text-[13px] text-bevel-text-secondary dark:text-slate-400 mb-2.5 leading-relaxed">{habit.description}</p>
          )}

          <div className="flex gap-1.5">
            <button
              onClick={handleYes}
              className={`flex-1 py-1.5 rounded-full font-medium text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
                habit.completed
                  ? 'bg-teal text-white shadow-sm'
                  : 'bg-white/55 dark:bg-slate-800/55 text-teal hover:bg-teal/10 active:scale-[0.98]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Yes
            </button>
            <button
              onClick={handleNo}
              className={`flex-1 py-1.5 rounded-full font-medium text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
                habit.completed === false && habit.missNote
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-white/55 dark:bg-slate-800/55 text-bevel-text-secondary dark:text-slate-400 hover:bg-gray-100/70 dark:hover:bg-slate-700 active:scale-[0.98]'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
