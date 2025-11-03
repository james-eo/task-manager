# Task Tracker Agent for Telex.im

A smart task tracking assistant built with TypeScript and integrated with Telex.im using the A2A protocol.

## 🚀 Features

- **Create Tasks**: Add new tasks with titles and automatic priority/status
- **List Tasks**: View all tasks organized by status (pending, in-progress, completed)
- **Complete Tasks**: Mark tasks as completed by ID or title
- **Delete Tasks**: Remove unwanted tasks
- **Natural Language**: Understanding of conversational requests
- **Telex Integration**: Full A2A protocol support for seamless chat integration

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **Express.js** - Web server framework
- **Mastra Core** - AI agent framework (ready for advanced AI features)
- **A2A Protocol** - Telex.im integration standard

## 📋 Available Commands

### Direct Commands

- `create task [title]` - Create a new task
- `list tasks` - Show all your tasks
- `complete task [id/title]` - Mark as completed
- `delete task [id/title]` - Remove a task
- `help` - Show available commands

### Natural Language Examples

- "What tasks do I have?"
- "Show me my pending tasks"
- "Create a task to review the project proposal"
- "Mark the design task as completed"

## 🏃 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy `.env` and update if needed:

```bash
PORT=3000
NODE_ENV=development
AGENT_NAME=TaskTracker
AGENT_DESCRIPTION=A smart task tracking assistant
```

### 3. Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run production
pnpm start
```

### 4. Test Locally

```bash
# Health check
curl http://localhost:3000/a2a/health

# Test task creation
curl -X POST http://localhost:3000/a2a/test \
  -H "Content-Type: application/json" \
  -d '{"message": "create task Review project", "userId": "test-user"}'

# Test task listing
curl -X POST http://localhost:3000/a2a/test \
  -H "Content-Type: application/json" \
  -d '{"message": "list tasks", "userId": "test-user"}'
```

## 🌐 Telex.im Integration

### Public Endpoint

- **URL**: `https://toey-unhieratically-shannan.ngrok-free.dev`
- **A2A Endpoint**: `/a2a/agent/taskTracker`
- **Health Check**: `/a2a/health`

### Workflow Configuration

Use the `telex-workflow.json` file for Telex.im integration. This contains the Mastra workflow definition with proper A2A node configuration.

### Testing A2A Integration

```bash
curl -X POST https://toey-unhieratically-shannan.ngrok-free.dev/a2a/agent/taskTracker \
  -H "Content-Type: application/json" \
  -d '{
    "messageId": "test-123",
    "userId": "user-456",
    "channelId": "channel-789",
    "content": "create task Test integration",
    "timestamp": "2025-11-03T12:30:00.000Z"
  }'
```

## 📁 Project Structure

```
src/
├── agents/
│   └── taskTracker.ts     # Main agent logic
├── routes/
│   └── a2a.ts            # A2A protocol endpoints
├── types/
│   └── index.ts          # TypeScript interfaces
└── index.ts              # Express server setup

telex-workflow.json        # Mastra workflow for Telex
```

## 🔧 API Endpoints

- `GET /` - Service info and available endpoints
- `GET /a2a/health` - Health check for monitoring
- `POST /a2a/agent/taskTracker` - Main A2A endpoint for Telex
- `POST /a2a/test` - Test endpoint for development

## 🎯 Future Enhancements

- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Due date tracking and reminders
- [ ] Task priorities and categories
- [ ] Advanced AI with full Mastra integration
- [ ] User authentication and multi-tenant support
- [ ] Task sharing and collaboration features

## 📝 Development Notes

- Tasks are currently stored in memory (reset on server restart)
- Ready for Mastra AI integration (commented code available)
- Full A2A protocol compliance for Telex.im
- TypeScript for type safety and better development experience

## 🚀 Deployment

Currently deployed using ngrok for development. For production, consider:

- Railway.app
- Render.com
- Vercel
- Heroku
- Digital Ocean

## 📄 License

MIT License - feel free to use and modify as needed.
