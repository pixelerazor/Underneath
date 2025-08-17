import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConnectedDom {
  id: string;
  name: string;
  level: number;
}

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
  connectedDom: ConnectedDom | null; // NEU
  invitationCode: string | null;
  codeExpiresAt: Date | null;

  setConnection: (data: { sub?: ConnectedSub; dom?: ConnectedDom }) => void; // GEÄNDERT
  clearConnection: () => void;
  setInvitationCode: (code: string, expiresAt: Date) => void;
  clearInvitationCode: () => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      isConnected: false,
      connectedSub: null,
      connectedDom: null, // NEU
      invitationCode: null,
      codeExpiresAt: null,

      setConnection: (
        data // GEÄNDERT
      ) =>
        set((state) => ({
          isConnected: true,
          connectedSub: data.sub !== undefined ? data.sub : state.connectedSub,
          connectedDom: data.dom !== undefined ? data.dom : state.connectedDom,
        })),

      clearConnection: () =>
        set({
          isConnected: false,
          connectedSub: null,
          connectedDom: null, // NEU
        }),

      // Rest bleibt unverändert
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
