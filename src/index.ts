import { Hono } from "hono";
import { cors } from "hono/cors";

import { AIServiceFactory } from "./services/ai-service-factory";
import { MCPController } from "./controllers/mcp-controller";

const app = new Hono<{ Bindings: Bindings }>();

// Add CORS middleware
app.use("*", cors());

// Setup routes
app.get("/", (c) => c.redirect("/index.html"));

app.get("/message", (c) => {
  return c.text("MCP Server is running!");
});

// MCP API endpoint
app.post("/api/mcp", async (c) => {
  try {
    const aiService = AIServiceFactory.createService(c.env);
    const mcpController = new MCPController(aiService);
    return mcpController.handleRequest(c);
  } catch (error) {
    console.error("Error creating AI service:", error);
    return c.json(
      {
        error: "Failed to initialize AI service",
        message: (error as Error).message
      },
      500
    );
  }
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    version: "1.0.0",
    provider: c.env.AI_PROVIDER
  });
});

// Provider info endpoint
app.get("/api/provider", (c) => {
  return c.json({
    provider: c.env.AI_PROVIDER,
    model: c.env.DEFAULT_MODEL
  });
});

export default app;
