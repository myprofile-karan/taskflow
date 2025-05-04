export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
};

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  taskId: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type TaskFilter = {
  search?: string;
  status?: Status | null;
  priority?: Priority | null;
  dueDate?: 'all' | 'today' | 'week' | 'overdue' | null;
};