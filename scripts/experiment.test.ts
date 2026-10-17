import { afterEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { prepare, record, validateConfig } from "./experiment";

const roots: string[] = [];
afterEach(async () => {
  // Only remove the unique fixture directories created by mkdtemp in this test.
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })));
});

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "paws-test-"));
  roots.push(root);
  await mkdir(join(root, "profiles"));
  await writeFile(join(root, "author.md"), "AUTHOR ONLY: future lesson and hidden facts");
  await writeFile(join(root, "profiles/dog.md"), "Dog likes investigation and company.");
  await writeFile(join(root, "profiles/cat.md"), "Cat values distance.");
  const config = {
    name: "opening",
    purpose: "Introduce different perceptions.",
    decisions: ["No interaction yet."],
    sources: ["author.md"],
    characters: [
      { id: "dog", profile: "profiles/dog.md", experience: "DOG PRIVATE: lamppost and Human." },
      { id: "cat", profile: "profiles/cat.md", experience: "CAT PRIVATE: back door and hedge." },
    ],
  };
  await writeFile(join(root, "config.json"), JSON.stringify(config));
  return { root, config };
}

test("preparation isolates author sources and other characters, and snapshots exact inputs", async () => {
  const { root } = await fixture();
  const run = await prepare(root, "config.json");
  const dog = await readFile(join(run, "packets/dog.md"), "utf8");
  expect(dog).toContain("DOG PRIVATE");
  expect(dog).not.toContain("CAT PRIVATE");
  expect(dog).not.toContain("AUTHOR ONLY");
  expect(await readFile(join(run, "packets/controller.md"), "utf8")).toContain("AUTHOR ONLY");
  const manifest = JSON.parse(await readFile(join(run, "manifest.json"), "utf8"));
  await writeFile(join(root, "author.md"), "changed source");
  expect(await readFile(join(run, manifest.sources[0].snapshot), "utf8")).toContain("AUTHOR ONLY");
  expect(manifest.sources[0].sha256).toHaveLength(64);
  const second = await prepare(root, "config.json");
  expect(second).not.toBe(run);
});

test("records preserve bytes and separate repeated contributions without overwriting", async () => {
  const { root } = await fixture();
  const run = await prepare(root, "config.json");
  const text = "Dog’s response.\r\nAnother line.\r\n";
  await writeFile(join(root, "response.md"), text);
  const first = await record(root, relative(root, run), "dog", "response", "response.md", "manual-model");
  const second = await record(root, relative(root, run), "dog", "response", "response.md");
  expect(first).not.toBe(second);
  const saved = JSON.parse(await readFile(first, "utf8"));
  expect(Buffer.from(saved.contentBase64, "base64").toString("utf8")).toBe(text);
  expect(saved.text).toBe(text);
  expect(saved.model).toBe("manual-model");
  expect(await readdir(join(run, "records"))).toHaveLength(2);
});

test("invalid profiles fail before a run is created", async () => {
  const { root, config } = await fixture();
  config.characters[0]!.profile = "missing.md";
  await writeFile(join(root, "config.json"), JSON.stringify(config));
  await expect(prepare(root, "config.json")).rejects.toThrow();
  expect(await readdir(root)).not.toContain("runs");
});

test("source paths cannot escape repository even when target exists", async () => {
  const { root, config } = await fixture();
  const other = await fixture();
  config.sources = [relative(root, join(other.root, "author.md"))];
  await writeFile(join(root, "config.json"), JSON.stringify(config));
  await expect(prepare(root, "config.json")).rejects.toThrow("escapes");
});

test("record rejects unknown actors and kinds without saving anything", async () => {
  const { root } = await fixture();
  const run = await prepare(root, "config.json");
  await expect(record(root, run, "intruder", "response", "author.md")).rejects.toThrow("Unknown actor");
  await expect(record(root, run, "dog", "invalid", "author.md")).rejects.toThrow("kind must");
  expect(await readdir(join(run, "records"))).toHaveLength(0);
});

test("configuration rejects duplicate and unsafe character ids", async () => {
  const { config } = await fixture();
  config.characters[1]!.id = "dog";
  expect(() => validateConfig(config)).toThrow("unique lowercase slugs");
  config.characters[1]!.id = "../cat";
  expect(() => validateConfig(config)).toThrow("unique lowercase slugs");
});
