# TaskPro - AI Task Management Agent

TaskPro is an intelligent personal assistant built with Mastra that helps you organize your day, week, month, and year by managing tasks efficiently through natural language.

## Features

- 🤖 **Natural Language Understanding**: Just tell it what you need to do in plain English
- 📅 **Smart Scheduling**: Automatically extracts dates, times, and deadlines
- ⚡ **Priority Intelligence**: Assigns priority based on context and urgency
- ⏰ **Reminder System**: Sets intelligent reminders based on priority
- 📊 **Proactive Organization**: Helps plan daily, weekly, and monthly schedules
- ✅ **Full Task Management**: Create, list, update, complete, and delete tasks

## How It Works

### Example Interactions

**Creating Tasks:**

```
You: "I have a dev meeting tomorrow by 10 pm"
TaskPro: Task "Dev Meeting" created successfully!
- Due: November 5, 2025 at 10:00 PM
- Priority: High
- Reminder: 2 hours before
```

**Natural Language Dates:**

```
You: "Remind me to submit my report next Monday at 2pm"
TaskPro: Task "Submit Report" created!
- Due: November 10, 2025 at 2:00 PM
- Priority: Medium
```

**Viewing Tasks:**

```
You: "What do I need to do today?"
TaskPro: You have 3 tasks due today:
1. Dev Meeting (High Priority) - 10:00 PM
2. Code review (Medium Priority) - 3:00 PM
3. Email client (Low Priority) - 5:00 PM
```

## Priority Assignment

TaskPro intelligently assigns priorities based on keywords and context:

- **Urgent**: Keywords like "ASAP", "urgent", "critical", or tasks due within 24 hours
- **High**: Important tasks, meetings, deadlines within 2-3 days
- **Medium**: Regular tasks, general to-dos
- **Low**: Nice-to-have tasks, long-term goals

## Available Commands

- Create tasks: "Schedule a meeting...", "Remind me to...", "I need to..."
- List tasks: "What's on my schedule?", "Show my tasks", "What do I have today?"
- Update tasks: "Change the deadline for...", "Update priority of..."
- Complete tasks: "Mark task as done", "Complete..."
- View by time: "Today's tasks", "This week's schedule", "Show overdue tasks"

## Technical Stack

- **Framework**: [Mastra](https://mastra.ai)
- **Language Model**: Groq Llama 3.3 70B
- **Language**: TypeScript
- **Storage**: In-memory (can be upgraded to persistent storage)

## Project Structure

```
src/mastra/
├── agents/
│   └── task-tracker-agent.ts    # Main AI agent with NLP capabilities
├── tools/
│   └── task-tool.ts              # Task management tools (CRUD operations)
└── index.ts                       # Mastra configuration
```

## Local Development

1. **Install dependencies:**

   ```bash
   cd taskpro
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with your Groq API key:

   ```
   GROQ_API_KEY=your_api_key_here
   ```

3. **Start the dev server:**

   ```bash
   pnpm run dev
   ```

4. **Open Studio:**
   Navigate to `http://localhost:4111/` to test the agent

## Deployment to Mastra Cloud

1. **Sign up for Mastra Cloud:**
   Visit [https://cloud.mastra.ai](https://cloud.mastra.ai)

2. **Connect GitHub:**

   - Push your code to GitHub
   - Connect your repository to Mastra Cloud
   - Mastra Cloud will automatically detect your agents and deploy them

3. **Set Environment Variables:**
   Add your `GROQ_API_KEY` in the Mastra Cloud dashboard

4. **Deploy:**
   Mastra Cloud provides automatic deployments on every push

## Integration with Telex.im

Once deployed, your agent will be available via REST API at:

```
https://your-app.mastra.cloud/a2a/agent/taskTrackerAgent
```

### Telex Workflow JSON

Use this workflow JSON to integrate with Telex.im:

```json
{
  "active": true,
  "category": "productivity",
  "description": "AI-powered task management assistant",
  "id": "taskpro_workflow",
  "long_description": "TaskPro is an intelligent personal assistant that helps you manage tasks through natural language. Just tell it what you need to do, and it will create tasks with smart scheduling, priority assignment, and reminders. Perfect for people who struggle with organization.",
  "name": "TaskPro Agent",
  "nodes": [
    {
      "id": "taskpro_agent",
      "name": "TaskPro",
      "parameters": {},
      "position": [800, 100],
      "type": "a2a/mastra-a2a-node",
      "typeVersion": 1,
      "url": "https://your-app.mastra.cloud/a2a/agent/taskTrackerAgent"
    }
  ],
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "short_description": "AI task manager with natural language support"
}
```

## API Endpoints

After deployment, you'll have access to:

- `POST /a2a/agent/taskTrackerAgent` - Chat with the agent
- `GET /api/agents/taskTrackerAgent` - Get agent info
- `GET /api/tools` - List all available tools

## Testing the Agent

### Test Scenarios

1. **Basic Task Creation:**

   - "I have a dentist appointment next Tuesday at 3pm"
   - "Remind me to call mom this evening"

2. **Complex Scheduling:**

   - "Schedule a code review session for tomorrow morning, it's urgent"
   - "I need to finish the project report by Friday afternoon"

3. **Task Management:**

   - "What's on my agenda for today?"
   - "Show me all urgent tasks"
   - "Mark the dentist appointment as completed"

4. **Organization:**
   - "Help me plan my week"
   - "What tasks are overdue?"
   - "Show me this week's schedule"

## View Agent Logs on Telex

To see your agent interactions:

1. Get your channel ID from Telex URL (first UUID)
2. Visit: `https://api.telex.im/agent-logs/{channel-id}.txt`

## Future Enhancements

- [ ] Persistent database storage (PostgreSQL/MongoDB)
- [ ] Email/SMS reminder notifications
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Recurring tasks support
- [ ] Task categories and tags
- [ ] Team collaboration features
- [ ] Voice input support
- [ ] Mobile app integration

## License

MIT

## Author

Built for HNG Backend Stage 3 Task

---

**Need Help?** The agent is designed to understand natural language, so just talk to it like you would to a personal assistant!
