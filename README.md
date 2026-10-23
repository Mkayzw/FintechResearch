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

## Amp orbs

Executable `.agents/setup` prepares fresh orbs with Bun **1.3.14**, matching the
Dockerfile, workspace dependencies, SvelteKit generated files and a production
build. The build is needed by the API's static-route tests. It copies `.env.example`
only when `.env` is absent; the app needs no database or secrets for local work.
Node.js comes from the orb base image.

Amp snapshots the prepared toolchain, dependencies and caches. Matching snapshots
skip setup; when setup runs again, Bun cheaply checks the restored dependencies
instead of forcing a reinstall. This repository ignores `bun.lock`, so setup uses
`bun install`, not `--frozen-lockfile`. The pinned Bun binary is available to new
login shells and supervised services in this checkout. No `.agents/resume` is
needed: there is no runtime authentication or connection to repair, and dependency
installation belongs only in setup.

Run `amp orb services ensure` to start the declared Fieldlab production preview
and print its authenticated portal links. The service builds before listening on
Amp's assigned `PORT` and checks `/healthz`. After editing source, run
`amp orb service restart fieldlab` to rebuild the preview. For hot-reload work, use
the local development commands above with a supervised orb service. Setup never
starts a server, and generated `.amp/portals/` files are ignored.

These files must reach the Amp project's default branch before they configure
future orbs. Local checks: `bash -n .agents/setup`, run `.agents/setup` twice, then
`bun test` and `bun run check`.

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
