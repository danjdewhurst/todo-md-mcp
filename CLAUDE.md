# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an MCP (Model Context Protocol) server that provides todo list functionality backed by markdown files. The server allows AI assistants to manage todo items in a standardized markdown format using MCP tools.

**Published Package**: Available on NPM as `@danjdewhurst/todo-md-mcp`
**NPM URL**: https://www.npmjs.com/package/@danjdewhurst/todo-md-mcp

## Development Commands
- `npm run build` - Build the TypeScript project
- `npm run dev` - Build and run the server  
- `npm run watch` - Watch for changes and rebuild
- `npm test` - Run the test suite with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Architecture
The project has a clean three-layer architecture:

### Core Components
- **index.ts**: Main MCP server implementation that handles protocol communication and tool registration
- **todoManager.ts**: Core business logic for CRUD operations and markdown parsing/formatting  
- **types.ts**: TypeScript type definitions for todos and requests

### Key Patterns
- Uses ES modules (`"type": "module"` in package.json)
- Strict TypeScript configuration with comprehensive type checking
- MCP protocol compliance with standardized tool definitions
- Markdown-based persistence with UUID tracking via HTML comments
- File format: `- [x] Task text <!-- id:uuid -->`

### Tool Interface
The server exposes 5 MCP tools:
- `list_todos` - Lists all todos with statistics
- `add_todo` - Creates new todo items
- `update_todo` - Modifies existing todos (text/completion status)
- `delete_todo` - Removes specific todos by ID
- `clear_completed` - Bulk removal of completed items

### Storage Strategy
- Todos stored in `todo.md` in project root
- Each todo has persistent UUID for reliable updates
- Standard markdown checkbox syntax with hidden ID comments
- Automatic file creation when first todo is added