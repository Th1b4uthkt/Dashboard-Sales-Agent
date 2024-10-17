import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card, CardContent } from "@/components/ui/card"

interface Task {
  id: string
  content: string
  status: 'todo' | 'in-progress' | 'done'
}

interface TaskItemProps {
  task: Task
  index: number
}

export function TaskItem({ task, index }: TaskItemProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white/5 hover:bg-white/10 transition-colors"
        >
          <CardContent className="p-4">
            {task.content}
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
