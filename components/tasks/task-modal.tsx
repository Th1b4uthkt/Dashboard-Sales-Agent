import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (content: string) => void
}

export function TaskModal({ isOpen, onClose, onAddTask }: TaskModalProps) {
  const [taskContent, setTaskContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskContent.trim()) {
      onAddTask(taskContent.trim())
      setTaskContent('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter task description"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
          />
          <Button type="submit">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
