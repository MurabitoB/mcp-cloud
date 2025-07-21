# MCP Cloud Project Instructions

## Project Overview

This is an Nx monorepo containing MCP (Model Context Protocol) Cloud applications with both API and UI components. The project uses TypeScript, Next.js for the frontend, and NestJS for the backend.

## Project Structure

- `apps/mcp-cloud-api/` - NestJS backend API server
- `apps/mcp-cloud-ui/` - Next.js frontend application
- `apps/mcp-cloud-api-e2e/` - E2E tests for the API
- `apps/mcp-cloud-ui-e2e/` - E2E tests for the UI using Playwright

## Key Technologies

- **Framework**: Nx workspace with TypeScript
- **Frontend**: Next.js 15, Tailwind CSS, React
- **Backend**: NestJS, Webpack
- **Testing**: Jest (unit), Playwright (E2E)
- **Package Manager**: pnpm

## Common Development Commands

### Development Servers

```bash
# Start UI development server
nx dev mcp-cloud-ui

# Start API development server
nx serve mcp-cloud-api

# Start both in development mode
nx run-many --target=dev --projects=mcp-cloud-ui,mcp-cloud-api
```

### Building

```bash
# Build UI for production
nx build mcp-cloud-ui

# Build API for production
nx build mcp-cloud-api

# Build both projects
nx run-many --target=build --projects=mcp-cloud-ui,mcp-cloud-api
```

### Testing

```bash
# Run unit tests
nx test mcp-cloud-ui
nx test mcp-cloud-api

# Run all tests
nx run-many --target=test
```

## Key Files to Reference

- [`apps/mcp-cloud-api/package.json`](apps/mcp-cloud-api/package.json) - API project configuration
- [`apps/mcp-cloud-ui/src/app/page.tsx`](apps/mcp-cloud-ui/src/app/page.tsx) - Main UI page component
- [`apps/mcp-cloud-ui-e2e/src/example.spec.ts`](apps/mcp-cloud-ui-e2e/src/example.spec.ts) - Example E2E test
- [`apps/mcp-cloud-ui-e2e/playwright.config.ts`](apps/mcp-cloud-ui-e2e/playwright.config.ts) - Playwright configuration
- [`README.md`](README.md) - Project documentation

## Development Guidelines

1. **Use Nx generators** for creating new components, services, and features
2. **Follow TypeScript best practices** with strict type checking enabled
3. **Write tests** for new features using Jest for unit tests and Playwright for E2E
4. **Use the workspace's shared configurations** for ESLint, Prettier, and TypeScript
5. **Leverage Nx caching** for faster builds and tests

## Useful Nx Commands

```bash
# Show project details
nx show project mcp-cloud-ui --web

# View dependency graph
nx graph

# Run affected tasks only
nx affected:build
nx affected:test

# Generate new components/features
nx g @nx/next:component ui/src/lib/button
nx g @nx/nest:service api/src/app/services/my-service
```

## Port Configuration

- **UI Development**: http://localhost:3000
- **API Development**: http://localhost:3000/api

When suggesting code changes, always consider the Nx workspace structure and use the appropriate project paths and naming conventions.
