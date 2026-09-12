# Strange Loops

A literature-grounded, interactive study of deterministic chaos in the ideal double pendulum. It combines a guided undergraduate narrative with a configurable Chaos Lab.

## Stack

- SvelteKit/Svelte 5 frontend
- Framework-free TypeScript physics engine in a Web Worker
- ElysiaJS/Bun API and production static host
- One multi-stage Docker image

## Run locally

1. Install dependencies: `bun install`
2. Start API: `bun run dev:api`
3. Start frontend in another terminal: `bun run dev:web`
4. Open `http://localhost:5173`

## Quality gates

- Tests: `bun test`
- Type/Svelte checks: `bun run check`
- Production build: `bun run build`

## Production

- Build: `docker build -t strange-loops .`
- Run: `docker run --rm -p 3000:3000 strange-loops`
- Open `http://localhost:3000`

See `docs/spec.md` for scope and `docs/research.md` for derivation and bibliography.
