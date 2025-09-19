'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

type AddTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addTask: (description: string, isUrgent: boolean, isImportant: boolean) => void;
};

export function AddTaskDialog({ open, onOpenChange, addTask }: AddTaskDialogProps) {
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (description.trim() === '') {
      toast({
        title: 'Error',
        description: 'Task description cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    addTask(description, isUrgent, isImportant);
    setDescription('');
    setIsUrgent(false);
    setIsImportant(false);
    onOpenChange(false);
    toast({
      title: 'Success',
      description: 'New task added to your matrix.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add a New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., 'Draft a blog post about AI agents'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="important" checked={isImportant} onCheckedChange={setIsImportant} />
              <Label htmlFor="important">Important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="urgent" checked={isUrgent} onCheckedChange={setIsUrgent} />
              <Label htmlFor="urgent">Urgent</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
