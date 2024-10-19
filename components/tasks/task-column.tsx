import React from 'react'
import { useDroppable } from '@dnd-kit/core'
// Supprimez ces importations si elles ne sont pas utilisées
// import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TaskItem } from './task-item'

interface Task {
  id: string
  user_id: string
  content: string
  status: 'todo' | 'in-progress' | 'done'
  created_at: string
  updated_at: string
}

interface TaskColumnProps {
  title: string
  status: 'todo' | 'in-progress' | 'done'
  tasks: Task[]
}

export function TaskColumn({ title, status, tasks }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef}>
      <h2>{title}</h2>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
