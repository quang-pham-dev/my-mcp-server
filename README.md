# MCP Server

A modern AI service proxy built with Cloudflare Workers and Hono framework, supporting multiple AI providers including Anthropic Claude and OpenAI.

## Features

- Multi-provider AI service integration (Anthropic Claude, OpenAI)
- Built on Cloudflare Workers for global edge deployment
- Fast and efficient request handling with Hono framework
- Type-safe implementation with TypeScript
- CORS support for cross-origin requests
- Health check and provider info endpoints

## Prerequisites

- Node.js (LTS version recommended)
- npm or pnpm package manager
- Cloudflare account for deployment
- API keys for supported AI providers

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env` with your API keys and preferences

## Development

Start the development server:

```bash
pnpm run dev
```

The server will start in development mode with hot reloading enabled.

## Deployment

Deploy to Cloudflare Workers:

```bash
pnpm run deploy
```

## API Endpoints

### Health Check
- `GET /health`
- Returns server status and configuration

### Provider Info
- `GET /api/provider`
- Returns current AI provider and model configuration

### MCP API
- `POST /api/mcp`
- Main endpoint for AI service requests
- Accepts JSON payload with context, query, and options

## Project Structure

```
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Type definitions
│   ├── services/        # AI service implementations
│   └── index.ts         # Main application entry
├── public/             # Static assets
└── wrangler.jsonc      # Cloudflare Workers configuration
```

## License

MIT
