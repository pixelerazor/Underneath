import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    role: 'DOM',
  },
];

export const WelcomeScreen = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const user = useAuthStore((state) => state.user);
};
