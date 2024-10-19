export interface Task {
  id: string;
  user_id: string;
  content: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
  updated_at: string;
}

