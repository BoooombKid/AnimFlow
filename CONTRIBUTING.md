# Contributing to AnimFlow

Thank you for helping improve AnimFlow.

## Development workflow

1. Fork the repository and create a focused branch.
2. Run `pnpm install`.
3. Make the change with tests when pipeline behavior changes.
4. Run `pnpm test` and `pnpm build`.
5. Open a pull request describing the user-facing impact.

## Pipeline template changes

- Keep numbered stages in production order.
- Separate shared resources from shot-specific work.
- Use three-digit shot IDs.
- Provide a clear description for every new folder node.
- Do not introduce application-specific names into general templates.

## Interface changes

- Keep the primary workflow visible and direct.
- Maintain keyboard accessibility and visible focus states.
- Test desktop and mobile layouts.
- Avoid adding controls that do not perform a real action.
