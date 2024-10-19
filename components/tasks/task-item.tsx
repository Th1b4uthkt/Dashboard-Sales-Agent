import React from 'react'
import { useDraggable } from '@dnd-kit/core'
// Supprimez cette importation si elle n'est pas utilisée
// import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from "@/components/ui/card"

interface Task {
  id: string
  content: string
  status: 'todo' | 'in-progress' | 'done'
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white/5 hover:bg-white/10 transition-colors cursor-grab"
    >
      <CardContent className="p-4">
        {task.content}
      </CardContent>
    </Card>
  )
}
