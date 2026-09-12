FROM oven/bun:1.3.14 AS dependencies
WORKDIR /app
COPY package.json tsconfig.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/physics/package.json packages/physics/package.json
RUN bun install

FROM dependencies AS build
COPY . .
RUN bun run build

FROM oven/bun:1.3.14-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/api ./apps/api
COPY --from=build /app/apps/web/build ./apps/web/build
COPY --from=build /app/packages ./packages
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD bun -e "const r=await fetch('http://localhost:3000/healthz');if(!r.ok)process.exit(1)"
CMD ["bun", "apps/api/src/index.ts"]
