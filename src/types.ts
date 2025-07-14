export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TodoFile {
  todos: TodoItem[];
  lastModified: Date;
}

export interface AddTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  id: string;
  text?: string;
  completed?: boolean;
}

export interface DeleteTodoRequest {
  id: string;
}

export interface ListTodosResponse {
  todos: TodoItem[];
  total: number;
  completed: number;
  pending: number;
}
