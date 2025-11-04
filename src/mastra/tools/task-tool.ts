import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// In-memory task storage (for MVP, can be replaced with database)
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  reminderTimes?: Date[];
  createdAt: Date;
  updatedAt: Date;
}

let tasks: Task[] = [];

// Helper function to generate unique IDs
function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Tool to create a new task
export const createTaskTool = createTool({
  id: "createTask",
  description:
    "Creates a new task with title, description, status, priority, due date, and reminder times. IMPORTANT: dueDate and reminderTimes MUST be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). Do NOT pass natural language dates like 'tomorrow at 10pm' - they will fail. Convert them first!",
  inputSchema: z.object({
    title: z.string().describe("The title or name of the task"),
    description: z.string().describe("Detailed description of the task"),
    status: z
      .enum(["pending", "in-progress", "completed", "cancelled"])
      .default("pending")
      .describe("Current status of the task"),
    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .describe("Priority level of the task"),
    dueDate: z
      .string()
      .optional()
      .describe(
        "Due date and time in ISO 8601 format ONLY (e.g., 2025-11-05T22:00:00Z). NOT natural language!"
      ),
    reminderTimes: z
      .array(z.string())
      .optional()
      .describe(
        "Array of reminder times in ISO 8601 format ONLY (e.g., ['2025-11-05T20:00:00Z']). NOT natural language!"
      ),
  }),
  execute: async ({ context }) => {
    const { title, description, status, priority, dueDate, reminderTimes } =
      context;

    const task: Task = {
      id: generateId(),
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminderTimes: reminderTimes?.map((time) => new Date(time)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(task);

    return {
      success: true,
      message: `Task "${title}" created successfully!`,
      task: {
        ...task,
        dueDate: task.dueDate?.toISOString(),
        reminderTimes: task.reminderTimes?.map((t) => t.toISOString()),
      },
    };
  },
});

// Tool to list all tasks
export const listTasksTool = createTool({
  id: "listTasks",
  description:
    "Lists all tasks or filters tasks by status or priority. Use this when the user wants to see their tasks, check what they need to do, or review their schedule.",
  inputSchema: z.object({
    status: z
      .enum(["pending", "in-progress", "completed", "cancelled"])
      .optional()
      .describe("Filter tasks by status"),
    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .optional()
      .describe("Filter tasks by priority"),
  }),
  execute: async ({ context }) => {
    const { status, priority } = context;

    let filteredTasks = tasks;

    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priority
      );
    }

    // Sort by priority (urgent > high > medium > low) and then by due date
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    filteredTasks.sort((a, b) => {
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    });

    return {
      success: true,
      count: filteredTasks.length,
      tasks: filteredTasks.map((task) => ({
        ...task,
        dueDate: task.dueDate?.toISOString(),
        reminderTimes: task.reminderTimes?.map((t) => t.toISOString()),
      })),
    };
  },
});

// Tool to update a task
export const updateTaskTool = createTool({
  id: "updateTask",
  description:
    "Updates an existing task by ID. Can update title, description, status, priority, due date, or reminder times. IMPORTANT: dueDate and reminderTimes MUST be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).",
  inputSchema: z.object({
    taskId: z.string().describe("The ID of the task to update"),
    title: z.string().optional().describe("New title for the task"),
    description: z.string().optional().describe("New description for the task"),
    status: z
      .enum(["pending", "in-progress", "completed", "cancelled"])
      .optional()
      .describe("New status"),
    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .optional()
      .describe("New priority level"),
    dueDate: z
      .string()
      .optional()
      .describe(
        "New due date in ISO 8601 format ONLY (e.g., 2025-11-05T22:00:00Z)"
      ),
    reminderTimes: z
      .array(z.string())
      .optional()
      .describe(
        "New reminder times in ISO 8601 format ONLY (e.g., ['2025-11-05T20:00:00Z'])"
      ),
  }),
  execute: async ({ context }) => {
    const {
      taskId,
      title,
      description,
      status,
      priority,
      dueDate,
      reminderTimes,
    } = context;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return {
        success: false,
        message: `Task with ID "${taskId}" not found.`,
      };
    }

    const task = tasks[taskIndex];

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (reminderTimes)
      task.reminderTimes = reminderTimes.map((time) => new Date(time));
    task.updatedAt = new Date();

    tasks[taskIndex] = task;

    return {
      success: true,
      message: `Task "${task.title}" updated successfully!`,
      task: {
        ...task,
        dueDate: task.dueDate?.toISOString(),
        reminderTimes: task.reminderTimes?.map((t) => t.toISOString()),
      },
    };
  },
});

// Tool to delete a task
export const deleteTaskTool = createTool({
  id: "deleteTask",
  description:
    "Deletes a task by ID. Use this when the user wants to remove or delete a task permanently.",
  inputSchema: z.object({
    taskId: z.string().describe("The ID of the task to delete"),
  }),
  execute: async ({ context }) => {
    const { taskId } = context;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return {
        success: false,
        message: `Task with ID "${taskId}" not found.`,
      };
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    return {
      success: true,
      message: `Task "${deletedTask.title}" deleted successfully!`,
    };
  },
});

// Tool to get tasks for today
export const getTodayTasksTool = createTool({
  id: "getTodayTasks",
  description:
    "Gets all tasks that are due today. Use this when the user asks about their tasks for today or what they need to do today.",
  inputSchema: z.object({}),
  execute: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      return (
        task.dueDate >= today &&
        task.dueDate < tomorrow &&
        task.status !== "completed" &&
        task.status !== "cancelled"
      );
    });

    return {
      success: true,
      count: todayTasks.length,
      tasks: todayTasks.map((task) => ({
        ...task,
        dueDate: task.dueDate?.toISOString(),
        reminderTimes: task.reminderTimes?.map((t) => t.toISOString()),
      })),
    };
  },
});

// Tool to get tasks for this week
export const getWeekTasksTool = createTool({
  id: "getWeekTasks",
  description:
    "Gets all tasks that are due this week. Use this when the user asks about their tasks for the week or weekly schedule.",
  inputSchema: z.object({}),
  execute: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const weekTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      return (
        task.dueDate >= today &&
        task.dueDate < nextWeek &&
        task.status !== "completed" &&
        task.status !== "cancelled"
      );
    });

    return {
      success: true,
      count: weekTasks.length,
      tasks: weekTasks.map((task) => ({
        ...task,
        dueDate: task.dueDate?.toISOString(),
        reminderTimes: task.reminderTimes?.map((t) => t.toISOString()),
      })),
    };
  },
});

// Tool to get overdue tasks
export const getOverdueTasksTool = createTool({
  id: "getOverdueTasks",
  description:
    "Gets all tasks that are overdue (past their due date and not completed). Use this when the user asks about overdue tasks or missed deadlines.",
  inputSchema: z.object({}),
  execute: async () => {
    const now = new Date();

    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      return (
        task.dueDate < now &&
        task.status !== "completed" &&
        task.status !== "cancelled"
      );
    });

    return {
      success: true,
      count: overdueTasks.length,
      tasks: overdueTasks.map((task) => ({
        ...task,
        dueDate: task.dueDate?.toISOString(),
        reminderTimes: task.reminderTimes?.map((t) => t.toISOString()),
      })),
    };
  },
});
