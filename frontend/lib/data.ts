// Mock data for demo purposes
// In a real app, this would be replaced with database calls

import { Task, User, Priority, Status, Notification } from "@/lib/types";

// Mock users
export const users: User[] = [
  {
    _id: "user-1",
    name: "Demo User",
    email: "demo@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo@example.com",
  },
  {
    _id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane@example.com",
  },
  {
    _id: "user-3",
    name: "Alex Johnson",
    email: "alex@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex@example.com",
  },
  {
    _id: "user-4",
    name: "Sam Taylor",
    email: "sam@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam@example.com",
  },
];

// Mock tasks
export const generateTasks = (userId: string): Task[] => {
  return [
    {
      _id: "task-1",
      title: "Complete project proposal",
      description: "Draft and finalize the proposal for the new client project",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      priority: Priority.HIGH,
      status: Status.TODO,
      createdBy: userId,
      assignedTo: userId,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "task-2",
      title: "Review design mockups",
      description: "Review the design mockups for the new website and prov_ide feedback",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      createdBy: "user-2",
      assignedTo: userId,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      _id: "task-3",
      title: "Test application features",
      description: "Test the new features in the application and report any bugs",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
      priority: Priority.HIGH,
      status: Status.TODO,
      createdBy: userId,
      assignedTo: "user-3",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "task-4",
      title: "Update documentation",
      description: "Update the user documentation to reflect the latest changes",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      priority: Priority.LOW,
      status: Status.TODO,
      createdBy: "user-3",
      assignedTo: userId,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "task-5",
      title: "Prepare presentation",
      description: "Prepare a presentation for the client meeting next week",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      priority: Priority.MEDIUM,
      status: Status.TODO,
      createdBy: "user-2",
      assignedTo: userId,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "task-6",
      title: "Review pull requests",
      description: "Review and approve pending pull requests in the codebase",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      priority: Priority.HIGH,
      status: Status.IN_PROGRESS,
      createdBy: userId,
      assignedTo: "user-4",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      _id: "task-7",
      title: "Optimize database queries",
      description: "_identify and optimize slow database queries in the application",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
      priority: Priority.MEDIUM,
      status: Status.COMPLETED,
      createdBy: "user-4",
      assignedTo: userId,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  ];
};

// Mock notifications
export const generateNotifications = (userId: string): Notification[] => {
  return [
    {
      _id: "notif-1",
      userId,
      taskId: "task-2",
      message: "You have been assigned to a new task: Review design mockups",
      read: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      _id: "notif-2",
      userId,
      taskId: "task-4",
      message: "You have been assigned to a new task: Update documentation",
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      _id: "notif-3",
      userId,
      taskId: "task-5",
      message: "You have been assigned to a new task: Prepare presentation",
      read: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      _id: "notif-4",
      userId,
      taskId: "task-3",
      message: "Task 'Test application features' due date is approaching",
      read: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
  ];
};