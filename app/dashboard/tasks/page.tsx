'use client'

import React, { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { TaskColumn } from '@/components/tasks/task-column'
import { TaskModal } from '@/components/tasks/task-modal'

interface Task {
  id: string
  content: string
  status: 'todo' | 'in-progress' | 'done'
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId as 'todo' | 'in-progress' | 'done' }
      }
      return task
    })

    setTasks(updatedTasks)
  }

  const addTask = (content: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      status: 'todo'
    }
    setTasks([...tasks, newTask])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Tasks</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn title="To Do" status="todo" tasks={tasks.filter(task => task.status === 'todo')} />
          <TaskColumn title="In Progress" status="in-progress" tasks={tasks.filter(task => task.status === 'in-progress')} />
          <TaskColumn title="Done" status="done" tasks={tasks.filter(task => task.status === 'done')} />
        </div>
      </DragDropContext>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={addTask} />
    </div>
  )
}
