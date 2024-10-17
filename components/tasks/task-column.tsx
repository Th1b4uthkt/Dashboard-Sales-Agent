import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TaskItem } from './task-item'

interface Task {
  id: string
  content: string
  status: 'todo' | 'in-progress' | 'done'
}

interface TaskColumnProps {
  title: string
  status: 'todo' | 'in-progress' | 'done'
  tasks: Task[]
}

export function TaskColumn({ title, status, tasks }: TaskColumnProps) {
  return (
    <Card className="bg-white/10 text-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <TaskItem key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
