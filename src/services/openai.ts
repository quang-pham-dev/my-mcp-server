import OpenAI from "openai";
import { CodeContext } from "../models/types";

export class OpenAIService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({
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
    // Prepare the context for the AI
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

    // Create the prompt
    const prompt = `
You are an AI coding assistant. You have access to the following code context:

${fullContext}

User query: ${query}

Please provide a helpful, accurate, and concise response.
`;

    // Call OpenAI API
    const response = await this.client.chat.completions.create({
      model: options?.model ?? this.model,
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens
    });

    return response.choices[0]?.message?.content ?? "No response generated";
  }
}
