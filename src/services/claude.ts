import Anthropic from "@anthropic-ai/sdk";
import { CodeContext } from "../models/types";

export class ClaudeService {
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(apiKey: string, model: string) {
    this.client = new Anthropic({
      apiKey
    });
    this.model = model;
  }

  async generateResponse(
    context: CodeContext,
    query: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    // Prepare the context for Claude
    const currentFileContext = `Current file (${context.currentFile.path}):\n${context.currentFile.content}`;

    let relevantFilesContext = "";
    if (context.relevantFiles && context.relevantFiles.length > 0) {
      relevantFilesContext =
        "Relevant files:\n" +
        context.relevantFiles
          .map((file) => `File: ${file.path}\n${file.content}`)
          .join("\n\n");
    }

    let projectStructureContext = "";
    if (context.projectStructure && context.projectStructure.length > 0) {
      projectStructureContext =
        "Project structure:\n" + context.projectStructure.join("\n");
    }

    // Combine all context
    const fullContext = [
      currentFileContext,
      relevantFilesContext,
      projectStructureContext
    ]
      .filter(Boolean)
      .join("\n\n");

    // Create the prompt for Claude
    const systemPrompt = `You are an AI coding assistant specialized in helping developers with their code. 
You have access to the user's code context and should provide helpful, accurate, and concise responses.
Focus on providing practical solutions and explanations.`;

    // Call Claude API
    const response = await this.client.messages.create({
      model: options?.model ?? this.model,
      max_tokens: options?.maxTokens ?? 4000,
      temperature: options?.temperature ?? 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `${fullContext}\n\nUser query: ${query}`
        }
      ]
    });

    return response.content[0].text;
  }
}
