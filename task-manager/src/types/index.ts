export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  userId: string; // For user persistence
}

export interface A2ARequest {
  messageId: string;
  userId: string;
  channelId: string;
  content: string;
  timestamp: string;
}

export interface A2AResponse {
  messageId: string;
  content: string;
  timestamp: string;
  metadata?: any;
}

export interface AgentContext {
  userId: string;
  channelId: string;
  tasks: Task[];
}

// User session interface
export interface UserSession {
  userId: string;
  channelId: string;
  lastActive: string;
  taskCount: number;
}
