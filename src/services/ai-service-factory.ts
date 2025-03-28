import { ClaudeService } from "./claude";
import { CursorService } from "./cursor";
import { OpenAIService } from "./openai";
import { CodeContext } from "../models/types";

export interface AIService {
  generateResponse(
    context: CodeContext,
    query: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string>;
}

export class AIServiceFactory {
  static createService(env: Bindings): AIService {
    const provider = env.AI_PROVIDER.toLowerCase();

    switch (provider) {
      case "anthropic":
        if (!env.ANTHROPIC_API_KEY) {
          throw new Error(
            "ANTHROPIC_API_KEY is required when using Anthropic as the AI provider"
          );
        }
        return new ClaudeService(env.ANTHROPIC_API_KEY, env.DEFAULT_MODEL);

      case "cursor":
        if (!env.CURSOR_API_KEY) {
          throw new Error(
            "CURSOR_API_KEY is required when using Cursor as the AI provider"
          );
        }
        return new CursorService(env.CURSOR_API_KEY);

      case "openai":
        if (!env.OPENAI_API_KEY) {
          throw new Error(
            "OPENAI_API_KEY is required when using OpenAI as the AI provider"
          );
        }
        return new OpenAIService(env.OPENAI_API_KEY, env.DEFAULT_MODEL);

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}
