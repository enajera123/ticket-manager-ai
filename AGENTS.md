# AGENTS.md - Developer Guidelines

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

- **Stack**: Vite + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **State Management**: Zustand
- **Backend**: Supabase
- **Forms**: Formik + Yup
- **UI Notifications**: Sonner (toasts), SweetAlert2 (confirmations)
- **Animations**: Framer Motion

---

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production (typecheck + vite build)
npm run preview      # Preview production build
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint on all files
```

**No test framework is configured** - this project does not have tests.

### Code Generation
```bash
npx shadcn@latest add <component>   # Add new shadcn/ui component
```

---

## Code Style Guidelines

### TypeScript Configuration
The project uses strict TypeScript with these settings:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true`

Always declare proper types. Avoid `any`. Use `unknown` when type is uncertain, then narrow.

### Import Organization
Order imports as follows:
1. External libraries (React, Zustand, etc.)
2. Internal imports (services, stores, hooks)
3. Type imports (`import type { ... }`)
4. Relative imports (components, utils)

Example:
```typescript
import { useState } from "react"
import { toast } from "sonner"
import { create } from "zustand"
import type { Ticket } from "@/model/Ticket"
import { useTicketStore } from "@/store/useTicketStore"
import TicketService from "@/services/ticket"
import { Card, CardHeader } from "@/components/ui/card"
import { getDaysLeft } from "@/lib/utils/date"
```

### Path Aliases
Use `@/` prefix for imports from `src/`:
```typescript
import { Button } from "@/components/ui/button"
import type { Ticket } from "@/model/Ticket"
import { useTicketStore } from "@/store/useTicketStore"
```

### Naming Conventions
- **Components**: PascalCase (`TicketCard.tsx`, `LoginForm.tsx`)
- **Hooks**: camelCase, prefix with `use` (`useTicketStore.ts`, `useDebounce.ts`)
- **Services**: PascalCase (`TicketService.ts`)
- **Types/Models**: PascalCase (`Ticket.ts`, `UserRole.ts`)
- **Enums**: PascalCase with UPPER_SNAKE values
- **Files**: kebab-case for utilities (`date.ts`, `fetch.ts`)

### Component Structure
Follow this pattern for React components:
```typescript
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Ticket } from "@/model/Ticket"

interface TicketCardProps {
  ticket: Ticket
  onEdit: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onEdit }: TicketCardProps) {
  // Hooks first
  const { updateTicket } = useTicketStore()

  // Early returns
  if (!ticket) return null

  // Render
  return (
    <motion.div>
      <Card>...</Card>
    </motion.div>
  )
}
```

### Error Handling
- Use `console.error()` for logging errors with context
- Show user-friendly messages via `toast.error()` from sonner
- For confirmations, use `showConfirmationAlert()` from `@/lib/utils/alert`
- Return `null` or empty array on errors in async functions

Example:
```typescript
try {
  const { data, error } = await TicketService.createTicket(ticket)
  if (error) {
    toast.error("Error al crear ticket", { description: error.message })
    console.error("Error creating ticket:", error)
    return null
  }
  return data
} catch (error) {
  const message = error instanceof Error ? error.message : "Error desconocido"
  toast.error("Error al crear ticket", { description: message })
  console.error("Error creating ticket:", error)
  return null
}
```

### UI Components
- Use shadcn/ui components from `@/components/ui/`
- Use Tailwind CSS for styling (v4 syntax)
- Use `cva` (class-variance-authority) for component variants
- Use `clsx` and `tailwind-merge` for conditional classes:
```typescript
import { cn } from "@/lib/utils"

<Card className={cn("hover:shadow-md", isOverdue && "border-red-300")}>
```

### Form Handling
- Use Formik with Yup validation schemas
- Schemas go in `src/schemas/` directory
- Use reusable field components: `InputField`, `SelectField`, `ComboBox`

### State Management & Hooks Architecture
This project uses a 3-layer architecture:

```
Components → Wrapper Hooks → Zustand Stores → Services
```

**Layer 1 - Zustand Stores** (`src/store/`):
- Use Zustand for state management
- Create subdirectories for related stores (`store/openRouter/`)
- Keep stores focused on state only (no business logic)

**Layer 2 - Wrapper Hooks** (`src/hooks/stores/`):
- Create wrapper hooks that provide clean API to components
- Handle auto-fetching when needed (e.g., `useProject` loads projects on mount)
- Always use wrapper hooks from components, not stores directly

**Layer 3 - Services** (`src/services/`):
- API layer for database operations
- Can extend `BaseService` for common CRUD patterns

Example patterns:

**Store** (`src/store/useTicketStore.ts`):
```typescript
import { create } from "zustand"

interface TicketState {
  tickets: Ticket[]
  isProcessing: boolean
  createTicket: (ticket: Ticket) => Promise<Ticket | null>
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  isProcessing: false,
  createTicket: async (ticket) => { ... }
}))
```

**Wrapper Hook** (`src/hooks/stores/useTicket.ts`):
```typescript
import { useTicketStore } from "@/store/useTicketStore"
import { useEffect } from "react"
import { useProjectStore } from "@/store/useProjectStore"

/**
 * Hook for ticket operations with auto-loading by current project.
 * Automatically fetches tickets when the current project changes.
 */
export function useTicket() {
  const tickets = useTicketStore((s) => s.tickets)
  const isProcessing = useTicketStore((s) => s.isProcessing)
  const getTicketsByProject = useTicketStore((s) => s.getTicketsByProject)
  const currentProject = useProjectStore((s) => s.currentProject)

  useEffect(() => {
    if (currentProject?.id) {
      getTicketsByProject(currentProject.id)
    }
  }, [currentProject?.id, getTicketsByProject])

  const createTicket = useTicketStore((s) => s.createTicket)
  const updateTicket = useTicketStore((s) => s.updateTicket)
  const deleteTicket = useTicketStore((s) => s.deleteTicket)

  return {
    tickets,
    isProcessing,
    createTicket,
    updateTicket,
    deleteTicket,
  }
}
```

**Component Usage**:
```typescript
// DO: Use wrapper hook
import { useTicket } from "@/hooks/stores/useTicket"
const { tickets, createTicket } = useTicket()

// DON'T: Use store directly
import { useTicketStore } from "@/store/useTicketStore" // Avoid
```
```typescript
import { create } from "zustand"

interface TicketState {
  tickets: Ticket[]
  isProcessing: boolean
  createTicket: (ticket: Ticket) => Promise<Ticket | null>
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  isProcessing: false,
  createTicket: async (ticket) => { ... }
}))
```

### Animations
- Use Framer Motion for transitions
- Common pattern:
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
```

---

## File Organization

```
src/
├── ai/                 # AI-related logic (OpenRouter integration)
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/     # Dashboard-specific components
│   ├── common/        # Shared components
│   └── auth/          # Authentication components
├── hooks/
│   ├── ai/            # AI-related hooks (e.g., useTicketClassifier)
│   ├── stores/        # Wrapper hooks (useTicket, useProject, useMember, etc.)
│   └── tickets/       # Feature-specific hooks
├── lib/
│   ├── config/        # Configuration (Supabase, etc.)
│   ├── constants/    # App constants
│   └── utils/        # Utility functions
├── model/            # TypeScript types and interfaces
│   └── enums/        # Enum definitions
├── routes/            # React Router routes
├── schemas/          # Yup validation schemas
├── services/
│   └── base/         # Base service class for CRUD operations
└── store/            # Zustand stores
```

### Important: Use Wrapper Hooks from Components

When writing components, always use wrapper hooks from `src/hooks/stores/`:
- `useTicket()` - for ticket operations with auto-fetch
- `useProject()` - for project operations with auto-fetch
- `useMember()` - for member operations
- `useGenerationCost()` - for cost tracking operations

Never access Zustand stores directly from components.

---

## Environment Variables

Create a `.env` file with required variables (see `.env.example` or existing `.env`):
- Supabase credentials
- OpenRouter API key

Never commit secrets to git.

---

## ESLint Rules

The project uses:
- `@eslint/js` - JavaScript recommended rules
- `typescript-eslint` - TypeScript rules
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - Validates React refresh

Run `npm run lint` before committing. Fix all warnings and errors.

---

## Building for Production

```bash
npm run build
```

This runs TypeScript type checking (`tsc -b`) first, then builds with Vite.
## Agent Configuration

This project uses OpenCode with four agent roles:
- **assistant**: Primary orchestrator - breaks down tasks and delegates. Does not write code.
- **architect**: Designs system architecture and implementation strategy. Does not write code.
- **implementor**: Executes implementation tasks, modifies files, can delegate UI to frontend-developer. Focus on correctness and project consistency.
- **frontend-developer**: Handles UI implementation using React + Tailwind. Only handles frontend/UI tasks.
- **backend-developer**: Handles backend development, APIs, databases, authentication, and server-side logic.
When working on frontend/UI tasks, delegate to the frontend-developer agent.
