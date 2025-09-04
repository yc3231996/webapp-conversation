# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `pnpm dev` - Start Next.js development server (default: http://localhost:3000)
- `pnpm install` - Install dependencies (preferred package manager)

### Code Quality & Building
- `pnpm lint` - Run ESLint to check code quality 
- `pnpm build` - Build production version (preferred)
- `pnpm start` - Start production server
- `npm run fix` or `npm run eslint-fix` - Auto-fix ESLint issues (fallback to npm)

## Project Architecture

### Core Framework
- **Next.js 14** with App Router architecture
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **i18next** for internationalization

### Key Dependencies
- **dify-client**: Core chat/conversation API client
- **zustand**: State management  
- **swr**: Data fetching and caching
- **react-markdown**: Markdown rendering with syntax highlighting
- **@monaco-editor/react**: Code editor component
- **ahooks**: React hooks utilities

### Application Structure

#### Authentication & Routing
- JWT-based authentication via middleware.ts:7-26
- Automatic redirect to `/login` for unauthenticated users
- API routes excluded from auth middleware

#### Configuration
- Environment setup via `.env.local` (see `.env.example`)
- App configuration in `config/index.ts`:
  - `APP_ID`, `API_KEY`, `API_URL` - Dify service connection
  - `APP_INFO` - App metadata and localization
  - `isShowPrompt`, `promptTemplate` - Chat behavior

#### Main Application Flow
The app follows a conversation-based chat interface pattern:

1. **Main Component** (`app/components/index.tsx`): Core application logic
   - Conversation management and state
   - Chat message handling and streaming
   - File upload support for vision features

2. **Service Layer** (`service/`): API communication
   - `base.ts` - HTTP client with auth and error handling
   - Integration with Dify chat API for streaming responses

3. **State Management**: 
   - Custom hooks in `hooks/` (conversation state, breakpoints)
   - Zustand for global state
   - SWR for server state and caching

#### Component Architecture
- **Sidebar**: Conversation list and management
- **Chat**: Message display with markdown, syntax highlighting, and file support
- **ConfigScene**: Input form configuration based on prompt variables
- **Welcome**: Initial app introduction and suggested questions

#### Internationalization
- Multi-language support via `i18n/` directory
- Default language configurable in `config/index.ts`
- Client-side and server-side i18n setup

#### File Upload & Vision
- Support for file uploads (images, documents)
- Vision API integration for image analysis
- Configurable file size limits and transfer methods

### Development Notes
- Uses `@antfu/eslint-config` with React hooks rules
- TypeScript strict mode enabled
- Path aliases configured: `@/*` maps to root directory
- Husky git hooks for lint-staged pre-commit checks
- **PNPM is the preferred package manager** - use `pnpm` commands instead of `npm`