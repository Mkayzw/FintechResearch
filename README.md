# Fieldlab Physics

An interactive Zimbabwe A-Level Physics platform. Mechanics begins with Projectile Motion and the advanced Strange Loops double-pendulum study.

## Stack

- SvelteKit/Svelte 5 frontend
- Framework-free TypeScript physics engine in a Web Worker
- ElysiaJS/Bun API and production static host
- Docker Compose deployment backed by one multi-stage image

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

- Build and start: `docker compose up --build -d`
- Check status: `docker compose ps`
- Follow logs: `docker compose logs -f fieldlab`
- Restart: `docker compose restart fieldlab`
- Stop and remove: `docker compose down`
- Open `http://localhost:3010`

Fieldlab reserves host port **3010** by default because port 3000 is already used by Metabase on this machine. To override it, for example: `FIELDLAB_PORT=3020 docker compose up --build -d`.

The Compose service is `fieldlab` and its stable container name is `fieldlab-physics`. `docker restart strange-loops` fails because no container with that name is created by this configuration. The previous `docker run --rm ...` workflow also removed the container when it stopped.

See `docs/platform-spec.md` for platform scope, `docs/spec.md` for Strange Loops, and `docs/research.md` for its derivation and bibliography.
