import { createClient } from '@/utils/supabase/client';
import { Task } from '../types/task';

const supabase = createClient();

export async function fetchTasks(): Promise<Task[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Task[];
}

export async function createTask(content: string): Promise<Task> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .insert({ content, status: 'todo', user_id: user.id })
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(task: Task): Promise<Task> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .update({ content: task.content, status: task.status, updated_at: new Date().toISOString() })
    .eq('id', task.id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
