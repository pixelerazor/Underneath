/**
 * Floating Action Menu Component
 * 
 * Main container for the floating action button and its overlay menu
 */

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { IndexForm } from './IndexForm';

interface FloatingActionMenuProps {
  onClose?: () => void;
}

export function FloatingActionMenu({ onClose }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
        <Button 
          onClick={handleOpen}
          className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Overlay Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          <VisuallyHidden>
            <DialogTitle>Neuen Eintrag erstellen</DialogTitle>
            <DialogDescription>Wähle den Typ des Eintrags aus</DialogDescription>
          </VisuallyHidden>
          {/* Index Form */}
          <IndexForm onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}