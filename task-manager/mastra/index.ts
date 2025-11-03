import { Mastra } from '@mastra/core';
import { TaskTrackerAgent } from '../src/agents/taskTracker';

export const mastra = new Mastra({
  agents: {
    taskTracker: new TaskTrackerAgent() as any
  }
});

export default mastra;