import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import a2aRoutes from "./routes/a2a";

// Load environment variables
dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/a2a", a2aRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Task Tracker Agent",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/a2a/health",
      agent: "/a2a/agent/taskTracker",
      test: "/a2a/test",
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Task Tracker Agent server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/a2a/health`);
  console.log(
    `🤖 Agent endpoint: http://localhost:${PORT}/a2a/agent/taskTracker`
  );
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/a2a/test`);
});

export default app;
