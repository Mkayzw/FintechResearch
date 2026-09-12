import { staticPlugin } from "@elysiajs/static";
import { Elysia, t } from "elysia";
import { presets, studyConfig } from "./data";

const stateSchema = t.Object({
  theta1: t.Number(),
  theta2: t.Number(),
  omega1: t.Number(),
  omega2: t.Number(),
});

const parametersSchema = t.Object({
  mass1: t.Number(),
  mass2: t.Number(),
  length1: t.Number(),
  length2: t.Number(),
  gravity: t.Number(),
});

const presetSchema = t.Object({
  id: t.String(),
  name: t.String(),
  tagline: t.String(),
  description: t.String(),
  state: stateSchema,
  parameters: parametersSchema,
  perturbation: t.Number(),
  solver: t.Union([t.Literal("rk4"), t.Literal("euler")]),
  timeStep: t.Number(),
});

const staticFiles = await staticPlugin({
  assets: new URL("../../web/build", import.meta.url).pathname,
  prefix: "/",
  alwaysStatic: true,
  indexHTML: true,
});

export const app = new Elysia()
  .get("/healthz", () => ({ status: "ok" as const }), {
    response: t.Object({ status: t.Literal("ok") }),
  })
  .get("/api/v1/config", () => studyConfig, {
    response: t.Object({
      contentVersion: t.String(),
      angleConvention: t.String(),
      defaultPresetId: t.String(),
      limits: t.Object({
        mass: t.Tuple([t.Number(), t.Number()]),
        length: t.Tuple([t.Number(), t.Number()]),
        gravity: t.Tuple([t.Number(), t.Number()]),
        timeStep: t.Tuple([t.Number(), t.Number()]),
      }),
    }),
  })
  .get("/api/v1/presets", () => presets, {
    response: t.Array(presetSchema),
  })
  .use(staticFiles);

if (import.meta.main) {
  app.listen(Number(Bun.env.PORT ?? 3000));
  console.log(
    `Strange Loops listening on http://localhost:${app.server?.port}`,
  );
}
