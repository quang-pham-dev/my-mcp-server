import { z } from "zod";

// Define the code context schema
export const CodeContextSchema = z.object({
  currentFile: z.object({
    path: z.string(),
    content: z.string(),
    selection: z.object({
      start: z.number(),
      end: z.number(),
    }).optional(),
  }),
  relevantFiles: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
    })
  ).optional(),
  projectStructure: z.array(z.string()).optional(),
});

export type CodeContext = z.infer<typeof CodeContextSchema>;

// Define the request schema
export const MCPRequestSchema = z.object({
  context: CodeContextSchema,
  query: z.string(),
  options: z.object({
    model: z.string().optional(),
    temperature: z.number().optional(),
    maxTokens: z.number().optional(),
  }).optional(),
});

export type MCPRequest = z.infer<typeof MCPRequestSchema>;

// Define the response schema
export const MCPResponseSchema = z.object({
  response: z.string(),
  metadata: z.object({
    model: z.string(),
    processingTime: z.number(),
  }),
});

export type MCPResponse = z.infer<typeof MCPResponseSchema>;