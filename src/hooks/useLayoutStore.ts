import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type WidgetType = 'tasks' | 'finance' | 'plan'

interface LayoutState {
  pinnedWidget: WidgetType
  setPinnedWidget: (widget: WidgetType) => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      pinnedWidget: 'tasks', // Default yang besar adalah Tasks
      setPinnedWidget: (widget) => set({ pinnedWidget: widget }),
    }),
    {
      name: 'lifeledger-layout-storage',
    }
  )
)