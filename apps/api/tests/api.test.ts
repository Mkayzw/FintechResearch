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

  test("serves the complete Mechanics course directly", async () => {
    const response = await app.handle(
      new Request("http://localhost/mechanics/"),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain("From motion");
    expect(html).toContain("Gravitational Field");
  });

  test("serves every published area and chapter as a direct static route", async () => {
    const areas = [
      ["general", "General Physics", ["g1", "g2"]],
      ["waves", "Oscillations and Waves", ["w1", "w2", "w3", "w4"]],
      ["electricity", "Electricity and Magnetism", ["e1", "e2", "e3", "e4", "e5", "e6"]],
      ["electronics", "Electronics", ["a1", "a2", "a3"]],
      ["matter", "Matter", ["m1", "m2", "m3", "m4", "m5"]],
      ["modern", "Modern Physics", ["q1", "q2", "q3", "q4"]],
      ["communication", "Communication", ["c1", "c2", "c3"]],
    ] as const;
    for (const [area, title, chapters] of areas) {
      const overview = await app.handle(new Request(`http://localhost/studies/${area}/`));
      expect(overview.status).toBe(200);
      const overviewHtml = await overview.text();
      expect(overviewHtml).toContain(title);
      expect(overviewHtml).toContain("Before you begin");
      for (const chapter of chapters) {
        const path = `/studies/${area}/${chapter}/`;
        expect(overviewHtml).toContain(`href="${path}"`);
        const response = await app.handle(new Request(`http://localhost${path}`));
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toContain("text/html");
        const html = await response.text();
        expect(html).toContain("Test my reasoning");
        expect(html).toContain("02 · Solve");
        expect(html).toContain("Investigate");
        expect(html).toContain("Provisional alignment");
      }
    }
  });

  test("does not serve a chapter under the wrong study area", async () => {
    const response = await app.handle(new Request("http://localhost/studies/waves/q1/"));
    expect(response.status).toBe(404);
  });
});
