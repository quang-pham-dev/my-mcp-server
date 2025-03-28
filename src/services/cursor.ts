import { CodeContext } from "../models/types";

export class CursorService {
  private readonly apiKey: string;
  private readonly apiUrl = "https://api.cursor.sh/v1/generate";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    context: CodeContext,
    query: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    // Prepare the context for Cursor
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

    // Create the request payload for Cursor API
    const payload = {
      messages: [
        {
          role: "system",
          content:
            "You are an AI coding assistant specialized in helping developers with their code."
        },
        {
          role: "user",
          content: `${fullContext}\n\nUser query: ${query}`
        }
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000
    };

    // Call Cursor API
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cursor API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    // Type assertion for the API response structure
    interface CursorResponse {
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    }
    return (data as CursorResponse).choices[0].message.content;
  }
}
