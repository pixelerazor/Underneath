import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserRole = 'ADMIN' | 'DOM' | 'SUB' | 'OBSERVER'
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'

interface User {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  displayName?: string
  avatarUrl?: string
  bio?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      login: (user, accessToken, refreshToken) => set({ 
        user, 
        isAuthenticated: true,
        accessToken,
        refreshToken
      }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null
      }),
    }),
    {
      name: 'auth-storage',
      // Wir speichern nur die notwendigen Daten im localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)