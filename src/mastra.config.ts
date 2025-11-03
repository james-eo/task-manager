export default {
  name: 'task-manager',
  agents: {
    taskTracker: {
      name: 'TaskTracker Agent',
      description: 'Smart task tracking and project management assistant',
      instructions: 'You are a helpful task tracking assistant that helps users manage their projects and deadlines efficiently.',
      model: {
        provider: 'groq',
        name: 'llama-3.1-70b-versatile'
      }
    }
  },
  integrations: {
    telex: {
      enabled: true,
      endpoint: '/a2a/agent/taskTracker'
    }
  }
};