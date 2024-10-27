import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from "@/components/ui/dialog"; // Import Shadcn dialog components

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const CustomDialog: React.FC<DialogProps> = ({ isOpen, onClose, title, description }) => {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogContent className="bg-white rounded-lg p-6 max-w-md mx-auto mt-20">
        <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
        
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
