'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { TaskColumn } from '@/components/tasks/task-column'
import { TaskItem } from '@/components/tasks/task-item'
import { TaskModal } from '@/components/tasks/task-modal'
import { fetchTasks, createTask, updateTask } from '@/lib/supabase-tasks'
import { Task } from '@/types/task'
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { toast } = useToast()

  const loadTasks = useCallback(async () => {
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks.filter(task => task !== null));
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast]);

  useEffect(() => {
    loadTasks();
    setupRealtimeSubscription();
  }, [loadTasks]);

  const setupRealtimeSubscription = () => {
    const supabase = createClient();
    const channel = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        console.log('Change received!', payload);
        if (payload.eventType === 'INSERT') {
          setTasks((prevTasks) => [payload.new as Task, ...prevTasks]);
        } else if (payload.eventType === 'UPDATE') {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === payload.new.id ? payload.new as Task : task))
          );
        } else if (payload.eventType === 'DELETE') {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = active.data.current?.task as Task;
    const overId = over.id as Task['status'];

    if (activeTask.status !== overId) {
      setTasks((tasks) =>
        tasks.map((t) =>
          t.id === activeTask.id ? { ...t, status: overId } : t
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = active.data.current?.task as Task;
    const overId = over.id as Task['status'];

    if (activeTask.status !== overId) {
      try {
        const updatedTask = await updateTask({ ...activeTask, status: overId });
        // Update the local state to reflect the change
        setTasks((tasks) =>
          tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
      } catch (error) {
        console.error('Error updating task:', error);
        // Revert the optimistic update if there was an error
        setTasks((tasks) =>
          tasks.map((t) =>
            t.id === activeTask.id ? { ...t, status: activeTask.status } : t
          )
        );
      }
    }
  };

  const addTask = async (content: string) => {
    const optimisticTask: Task = {
      id: Date.now().toString(), // Temporary ID
      content,
      status: 'todo',
      user_id: '', // This will be set by the server
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic update
    setTasks((prevTasks) => [optimisticTask, ...prevTasks]);

    try {
      const newTask = await createTask(content);
      // Replace the optimistic task with the real one
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === optimisticTask.id ? newTask : task))
      );
      toast({
        title: "Success",
        description: "New task added successfully.",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      // Remove the optimistic task on error
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== optimisticTask.id));
      toast({
        title: "Error",
        description: "Failed to add new task. Please try again.",
        variant: "destructive",
      });
    }
  }

  const validTasks = tasks.filter(task => task !== null && task.id !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Tasks</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <DndContext onDragStart={onDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SortableContext items={validTasks.map(task => task.id)}>
            <TaskColumn title="To Do" status="todo" tasks={validTasks.filter(task => task.status === 'todo')} />
            <TaskColumn title="In Progress" status="in-progress" tasks={validTasks.filter(task => task.status === 'in-progress')} />
            <TaskColumn title="Done" status="done" tasks={validTasks.filter(task => task.status === 'done')} />
          </SortableContext>
        </div>
        <DragOverlay>
          {activeId ? <TaskItem task={validTasks.find(task => task.id === activeId)!} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={addTask} />
    </div>
  )
}
