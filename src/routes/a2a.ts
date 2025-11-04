import express from "express";
import { TaskTrackerAgent } from "../agents/taskTracker";
import { A2ARequest, A2AResponse } from "../types";

const router: express.Router = express.Router();
const taskAgent = new TaskTrackerAgent();

// A2A endpoint for Telex.im integration
router.post("/agent/taskTracker", async (req, res) => {
  try {
    console.log("Received A2A request:", JSON.stringify(req.body, null, 2));

    // Handle empty JSON request from validator (Thanos fix)
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("Empty JSON request detected - returning 200 for validator");
      return res.status(200).json({
        message: "A2A endpoint is healthy and ready",
        timestamp: new Date().toISOString(),
        agentName: "TaskTracker",
      });
    }

    const request: A2ARequest = req.body;

    // Validate required fields
    if (!request.messageId || !request.userId || !request.content) {
      return res.status(400).json({
        error: "Missing required fields: messageId, userId, content",
      });
    }

    // Process the message with agent
    const response = await taskAgent.processMessage(request.content, {
      userId: request.userId,
      channelId: request.channelId,
      tasks: [], // This would be fetched from database when added
    });

    // Format A2A response
    const a2aResponse: A2AResponse = {
      messageId: Date.now().toString(),
      content: response,
      timestamp: new Date().toISOString(),
      metadata: {
        agentName: "TaskTracker",
        originalMessageId: request.messageId,
      },
    };

    console.log("Sending A2A response:", JSON.stringify(a2aResponse, null, 2));

    res.json(a2aResponse);
  } catch (error) {
    console.error("Error processing A2A request:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    agent: "TaskTracker",
  });
});

// Test endpoint for local development
router.post("/test", async (req, res) => {
  try {
    const { message, userId = "test-user" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await taskAgent.processMessage(message, {
      userId,
      channelId: "test-channel",
      tasks: [],
    });

    res.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
