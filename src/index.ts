#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TodoManager } from './todoManager.js';
import type {
  AddTodoRequest,
  UpdateTodoRequest,
  DeleteTodoRequest,
} from './types.js';

class TodoMCPServer {
  private server: Server;
  private todoManager: TodoManager;

  constructor() {
    this.server = new Server(
      {
        name: 'todo-md-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.todoManager = new TodoManager();
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_todos',
          description: 'List all todos from the markdown file',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'add_todo',
          description: 'Add a new todo item',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'The todo item text',
              },
            },
            required: ['text'],
            additionalProperties: false,
          },
        },
        {
          name: 'update_todo',
          description: 'Update an existing todo item',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'The todo item ID',
              },
              text: {
                type: 'string',
                description: 'New text for the todo item',
              },
              completed: {
                type: 'boolean',
                description: 'Whether the todo is completed',
              },
            },
            required: ['id'],
            additionalProperties: false,
          },
        },
        {
          name: 'delete_todo',
          description: 'Delete a todo item',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'The todo item ID to delete',
              },
            },
            required: ['id'],
            additionalProperties: false,
          },
        },
        {
          name: 'clear_completed',
          description: 'Remove all completed todo items',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'list_todos': {
            const result = await this.todoManager.listTodos();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'add_todo': {
            const args = request.params.arguments as unknown as AddTodoRequest;
            if (!args?.text || typeof args.text !== 'string') {
              throw new Error('Text is required and must be a string');
            }

            const todo = await this.todoManager.addTodo(args);
            return {
              content: [
                {
                  type: 'text',
                  text: `Todo added successfully: ${JSON.stringify(todo, null, 2)}`,
                },
              ],
            };
          }

          case 'update_todo': {
            const args = request.params
              .arguments as unknown as UpdateTodoRequest;
            if (!args?.id || typeof args.id !== 'string') {
              throw new Error('ID is required and must be a string');
            }

            const todo = await this.todoManager.updateTodo(args);
            return {
              content: [
                {
                  type: 'text',
                  text: `Todo updated successfully: ${JSON.stringify(todo, null, 2)}`,
                },
              ],
            };
          }

          case 'delete_todo': {
            const args = request.params
              .arguments as unknown as DeleteTodoRequest;
            if (!args?.id || typeof args.id !== 'string') {
              throw new Error('ID is required and must be a string');
            }

            await this.todoManager.deleteTodo(args);
            return {
              content: [
                {
                  type: 'text',
                  text: `Todo with ID ${args.id} deleted successfully`,
                },
              ],
            };
          }

          case 'clear_completed': {
            const count = await this.todoManager.clearCompleted();
            return {
              content: [
                {
                  type: 'text',
                  text: `Cleared ${count} completed todo(s)`,
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

async function main(): Promise<void> {
  const server = new TodoMCPServer();
  await server.run();
}

// Run the server when this file is executed directly
main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
