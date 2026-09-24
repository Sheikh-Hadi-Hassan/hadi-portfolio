import assert from "node:assert/strict";
import test from "node:test";

const portfolioTitle =
  /<title>Hadi Hassan — Creative Director &amp; Founder of Intellignce<\/title>/i;

test("renders finished portfolio metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, portfolioTitle);
  assert.doesNotMatch(html, /name=["']codex-preview["']/i);
  assert.match(html, /id=["']main-content["']/i);
  assert.match(html, /images\/projects\/morganics\/05-packaging-system\.webp/i);
  assert.match(html, /images\/projects\/bits-hr-link\/01-brand-system\.webp/i);
  assert.doesNotMatch(html, /_vinext\/image\?/i);
});
