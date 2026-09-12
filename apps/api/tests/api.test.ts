import { describe, expect, test } from "bun:test";
import { app } from "../src/index";

describe("study API", () => {
  test("reports container health", async () => {
    const response = await app.handle(new Request("http://localhost/healthz"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  test("publishes versioned study configuration", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/config"),
    );
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.contentVersion).toBe("1.0.0");
    expect(body.defaultPresetId).toBe("butterfly");
  });

  test("publishes curated presets", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/presets"),
    );
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.length).toBeGreaterThanOrEqual(2);
    expect(body[0].parameters.gravity).toBe(9.81);
  });

  test("serves the canonical projectile laboratory route directly", async () => {
    const response = await app.handle(
      new Request("http://localhost/mechanics/projectile-motion/"),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain("Beyond 45°");
  });
});
