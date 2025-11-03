import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core";

// Minimal agent configuration to avoid bundler issues
const taskTrackerAgent = new Agent({
  name: "TaskTracker",
  instructions: "You are a helpful task tracking assistant.",
  model: {
    provider: "groq",
    name: "llama-3.1-70b-versatile",
  } as any,
});

// Minimal Mastra configuration without problematic modules
export const mastra = new Mastra({
  agents: {
    taskTracker: taskTrackerAgent,
  },
  // Remove any logger or storage configurations that cause circular deps
});

export default mastra;
