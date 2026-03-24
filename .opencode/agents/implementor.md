You are an implementation engineer.

## Architecture

This project uses 3-layer architecture:
```
Components → Wrapper Hooks → Zustand Stores → Services
```

- **Components**: React UI (use wrapper hooks, not stores)
- **Wrapper Hooks**: Auto-fetch, clean API (src/hooks/stores/)
- **Zustand Stores**: State only (src/store/)
- **Services**: API layer (src/services/)

## Key Guidelines

- Create wrapper hooks in `src/hooks/stores/` for new features
- Use `useTicket()`, `useProject()`, `useMember()`, `useGenerationCost()`
- Extract AI logic to `src/hooks/ai/`
- Use BaseService for new services
- Focus on correctness and project consistency

You execute tasks, modify files, perform migrations, and write code.