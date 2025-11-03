import { Agent } from "@mastra/core";
import { Task, AgentContext } from "../types";

// In-memory storage (can be replaced with database later)
const userTasks: Map<string, Task[]> = new Map();

export class TaskTrackerAgent {
  private agent: Agent;

  constructor() {
    this.agent = new Agent({
      name: "TaskTracker",
      instructions: `
        You are a helpful task tracking assistant that helps users manage their projects and deadlines efficiently.

        Your primary functions include:
        - Creating new tasks with titles, descriptions, due dates, and priorities
        - Listing all tasks or filtering by status/priority
        - Updating task status (pending -> in-progress -> completed)
        - Setting reminders for upcoming deadlines
        - Deleting completed or unwanted tasks

        Always be friendly and provide clear, actionable responses.
        When creating tasks, ask for clarification if important details are missing.

        Available commands:
        - "create task [title]" - Create a new task
        - "list tasks" - Show all tasks
        - "complete task [id/title]" - Mark task as completed
        - "update task [id/title]" - Update task details
        - "delete task [id/title]" - Delete a task
        - "help" - Show available commands

        You can also understand natural language requests like:
        - "What tasks do I have for today?"
        - "Show me my high priority tasks"
        - "Help me organize my project tasks"
      `,
      model: {
        provider: "groq",
        name: "llama-3.1-70b-versatile",
      } as any,
    });
  }

  async processMessage(
    content: string,
    context: AgentContext
  ): Promise<string> {
    const { userId } = context;
    const userTaskList = userTasks.get(userId) || [];

    // Simple command parsing
    const command = content.toLowerCase().trim();

    if (command.includes("create task")) {
      return this.createTask(command, userId);
    } else if (command.includes("list tasks")) {
      return this.listTasks(userId);
    } else if (command.includes("complete task")) {
      return this.completeTask(command, userId);
    } else if (command.includes("delete task")) {
      return this.deleteTask(command, userId);
    } else if (command.includes("help")) {
      return this.getHelp();
    } else {
      // Use Mastra agent for natural language processing
      try {
        const userContext = `User has ${
          userTaskList.length
        } tasks. Recent tasks: ${JSON.stringify(userTaskList.slice(-3))}`;

        const result = await this.agent.generate([
          {
            role: "user",
            content: `${content}\n\nContext: ${userContext}`,
          },
        ]);

        return (
          result.text ||
          "I'm sorry, I couldn't process that request. Try using 'help' to see available commands."
        );
      } catch (error) {
        console.error("Error with Mastra agent:", error);
        return "I'm having trouble processing that request. Try using specific commands like 'create task', 'list tasks', or 'help'.";
      }
    }
  }

  private createTask(command: string, userId: string): string {
    const titleMatch = command.match(/create task (.+)/);
    if (!titleMatch) {
      return "Please specify a task title. Example: 'create task Review project proposal'";
    }

    let title = titleMatch[1];
    let priority: "low" | "medium" | "high" | "urgent" = "medium";
    let dueDate: string | undefined;

    // Extract priority from command
    const priorityMatch = title.match(
      /\s+(low|medium|high|urgent)\s*priority/i
    );
    if (priorityMatch) {
      priority = priorityMatch[1].toLowerCase() as
        | "low"
        | "medium"
        | "high"
        | "urgent";
      title = title
        .replace(/\s+(low|medium|high|urgent)\s*priority/i, "")
        .trim();
    }

    // Extract due date from command (simple format: "due tomorrow", "due 2025-11-05")
    const dueDateMatch = title.match(/\s+due\s+(.+?)(?:\s|$)/i);
    if (dueDateMatch) {
      const dueDateStr = dueDateMatch[1];
      if (dueDateStr.toLowerCase() === "tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = tomorrow.toISOString().split("T")[0];
      } else if (dueDateStr.toLowerCase() === "today") {
        dueDate = new Date().toISOString().split("T")[0];
      } else if (dueDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dueDate = dueDateStr;
      }
      title = title.replace(/\s+due\s+.+?(?:\s|$)/i, "").trim();
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: "pending",
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    const userTaskList = userTasks.get(userId) || [];
    userTaskList.push(newTask);
    userTasks.set(userId, userTaskList);

    const priorityEmoji =
      priority === "urgent"
        ? "🔴"
        : priority === "high"
        ? "🟠"
        : priority === "medium"
        ? "🟡"
        : "🟢";
    const dueDateText = dueDate ? `\nDue: ${dueDate}` : "";

    return `✅ Task created successfully!\n**${title}** (ID: ${newTask.id})\nStatus: Pending | Priority: ${priority} ${priorityEmoji}${dueDateText}`;
  }

  private listTasks(userId: string): string {
    const userTaskList = userTasks.get(userId) || [];

    if (userTaskList.length === 0) {
      return "📝 You don't have any tasks yet. Create one with: 'create task [title]'";
    }

    // Sort tasks by priority and due date
    const sortedTasks = userTaskList.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];

      if (aPriority !== bPriority) return bPriority - aPriority;

      // If same priority, sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return 0;
    });

    const tasksByStatus = {
      pending: sortedTasks.filter((t) => t.status === "pending"),
      "in-progress": sortedTasks.filter((t) => t.status === "in-progress"),
      completed: sortedTasks.filter((t) => t.status === "completed"),
    };

    let response = "📋 **Your Tasks:**\n\n";

    Object.entries(tasksByStatus).forEach(([status, tasks]) => {
      if (tasks.length > 0) {
        response += `**${status.toUpperCase()}** (${tasks.length})\n`;
        tasks.forEach((task) => {
          const priority =
            task.priority === "urgent"
              ? "🔴"
              : task.priority === "high"
              ? "�"
              : task.priority === "medium"
              ? "🟡"
              : "🟢";

          const dueDateInfo = task.dueDate ? ` | Due: ${task.dueDate}` : "";
          const isOverdue =
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== "completed";
          const overdueFlag = isOverdue ? " ⚠️ OVERDUE" : "";

          response += `${priority} ${task.title} (ID: ${task.id})${dueDateInfo}${overdueFlag}\n`;
        });
        response += "\n";
      }
    });

    return response;
  }

  private completeTask(command: string, userId: string): string {
    const taskMatch = command.match(/complete task (.+)/);
    if (!taskMatch) {
      return "Please specify a task ID or title. Example: 'complete task 123' or 'complete task Review proposal'";
    }

    const identifier = taskMatch[1];
    const userTaskList = userTasks.get(userId) || [];

    const task = userTaskList.find(
      (t) =>
        t.id === identifier ||
        t.title.toLowerCase().includes(identifier.toLowerCase())
    );

    if (!task) {
      return `❌ Task not found: "${identifier}". Use 'list tasks' to see your tasks.`;
    }

    task.status = "completed";
    task.updatedAt = new Date().toISOString();
    userTasks.set(userId, userTaskList);

    return `🎉 Task completed: **${task.title}**`;
  }

  private deleteTask(command: string, userId: string): string {
    const taskMatch = command.match(/delete task (.+)/);
    if (!taskMatch) {
      return "Please specify a task ID or title. Example: 'delete task 123'";
    }

    const identifier = taskMatch[1];
    const userTaskList = userTasks.get(userId) || [];

    const taskIndex = userTaskList.findIndex(
      (t) =>
        t.id === identifier ||
        t.title.toLowerCase().includes(identifier.toLowerCase())
    );

    if (taskIndex === -1) {
      return `❌ Task not found: "${identifier}". Use 'list tasks' to see your tasks.`;
    }

    const deletedTask = userTaskList.splice(taskIndex, 1)[0];
    userTasks.set(userId, userTaskList);

    return `🗑️ Task deleted: **${deletedTask.title}**`;
  }

  private getHelp(): string {
    return `🤖 **Task Tracker Commands:**

📝 **Create Tasks:**
• \`create task [title]\` - Create a new task
• \`create task [title] high priority\` - Create with priority
• \`create task [title] due tomorrow\` - Create with due date
• \`create task [title] urgent priority due 2025-11-05\` - Full featured

📋 **View Tasks:**
• \`list tasks\` - Show all your tasks (sorted by priority and due date)

✅ **Update Tasks:**
• \`complete task [id/title]\` - Mark as completed

🗑️ **Delete Tasks:**
• \`delete task [id/title]\` - Remove a task

🎯 **Priority Levels:**
• � Urgent - Critical tasks
• 🟠 High - Important tasks  
• 🟡 Medium - Regular tasks (default)
• 🟢 Low - Nice-to-have tasks

📅 **Due Date Examples:**
• "due today" - Today's date
• "due tomorrow" - Tomorrow's date
• "due 2025-11-05" - Specific date (YYYY-MM-DD)

�💬 **Natural Language:**
You can also ask me questions like:
• "What tasks do I have for today?"
• "Show me my overdue tasks"
• "What high priority tasks do I have?"
• "Help me organize my project tasks"

Just type your message and I'll help you manage your tasks! 🚀

⚠️ **Note:** Overdue tasks are marked with ⚠️ in your task list.`;
  }
}
