import { Context } from "hono";
import { AIService } from "../services/ai-service-factory";
import { MCPRequestSchema, MCPResponse } from "../models/types";

export class MCPController {
  private readonly aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async handleRequest(c: Context): Promise<Response> {
    try {
      // Parse and validate the request
      const body = await c.req.json();
      const result = MCPRequestSchema.safeParse(body);

      if (!result.success) {
        return c.json(
          { error: "Invalid request format", details: result.error.format() },
          400
        );
      }

      const request = result.data;
      const startTime = Date.now();

      // Generate response using the AI service
      const response = await this.aiService.generateResponse(
        request.context,
        request.query,
        request.options
      );

      const processingTime = Date.now() - startTime;

      // Prepare the response
      const mcpResponse: MCPResponse = {
        response,
        metadata: {
          model: request.options?.model ?? c.env.DEFAULT_MODEL,
          processingTime
        }
      };

      return c.json(mcpResponse);
    } catch (error) {
      console.error("Error processing request:", error);
      return c.json(
        {
          error: "Failed to process request",
          message: (error as Error).message
        },
        500
      );
    }
  }
}
