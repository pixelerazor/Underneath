import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConnectedSub {
  id: string;
  name: string;
  level: number;
  levelTitle: string;
  points: number;
  maxPoints: number;
}

interface ConnectionState {
  isConnected: boolean;
  connectedSub: ConnectedSub | null;
  invitationCode: string | null;
  codeExpiresAt: Date | null;

  setConnection: (sub: ConnectedSub) => void;
  clearConnection: () => void;
  setInvitationCode: (code: string, expiresAt: Date) => void;
  clearInvitationCode: () => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      isConnected: false,
      connectedSub: null,
      invitationCode: null,
      codeExpiresAt: null,

      setConnection: (sub) =>
        set({
          isConnected: true,
          connectedSub: sub,
        }),

      clearConnection: () =>
        set({
          isConnected: false,
          connectedSub: null,
        }),

      setInvitationCode: (code, expiresAt) =>
        set({
          invitationCode: code,
          codeExpiresAt: expiresAt,
        }),

      clearInvitationCode: () =>
        set({
          invitationCode: null,
          codeExpiresAt: null,
        }),
    }),
    {
      name: 'connection-storage',
    }
  )
);
