import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

type Character = { id: string; profile: string; experience: string };
type Config = {
  name: string;
  purpose: string;
  decisions: string[];
  sources: string[];
  characters: Character[];
};
type Source = { path: string; snapshot: string; sha256: string };
type Manifest = {
  version: 1;
  id: string;
  createdAt: string;
  runtime: string;
  mode: "manual";
  config: Config;
  sources: Source[];
};

const digest = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
const inside = (parent: string, child: string) => {
  const path = relative(parent, child);
  return path === "" || (!isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`));
};
const slug = /^[a-z][a-z0-9-]*$/;
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export function validateConfig(value: unknown): Config {
  if (!value || typeof value !== "object") throw new Error("Configuration must be an object.");
  const config = value as Config;
  if (!nonempty(config.name) || !slug.test(config.name)) throw new Error("name must be a lowercase slug.");
  if (!nonempty(config.purpose)) throw new Error("purpose must be nonempty.");
  if (!Array.isArray(config.decisions) || !config.decisions.every(nonempty)) throw new Error("decisions must be an array of nonempty strings.");
  if (!Array.isArray(config.sources) || !config.sources.length || !config.sources.every(nonempty)) throw new Error("sources must list controller-only source files.");
  if (!Array.isArray(config.characters) || !config.characters.length) throw new Error("At least one character is required.");
  const ids = new Set<string>();
  for (const character of config.characters) {
    if (!character || !nonempty(character.id) || !slug.test(character.id) || character.id === "controller" || ids.has(character.id)) {
      throw new Error("Character ids must be unique lowercase slugs other than controller.");
    }
    if (!nonempty(character.profile) || !nonempty(character.experience)) throw new Error(`Missing profile or experience for ${character.id}.`);
    ids.add(character.id);
  }
  return config;
}

async function sourcePath(root: string, path: string) {
  if (isAbsolute(path)) throw new Error(`Source paths must be repository-relative: ${path}`);
  const absolute = await realpath(resolve(root, path));
  if (!inside(root, absolute)) throw new Error(`Source escapes the repository: ${path}`);
  return absolute;
}

/** Explicitly selected profile and experience only; no author sources or other characters. */
export function characterPacket(character: Character, profile: string) {
  return `# Character packet: ${character.id}\n\nYou portray this character in a directed story. Use only this packet and subsequent experiences supplied by the controller. Do not read repository files or another agent's context. Thoughts are private; Cat and Dog have no shared spoken language. Portray directed actions consistently with your persona, and distinguish open attempts from established outcomes. Do not invent other characters' thoughts or uncertain outcomes.\n\n## Approved profile\n\n${profile.trim()}\n\n## Current experience\n\n${character.experience.trim()}\n`;
}

export async function prepare(rootPath: string, configPath: string) {
  const root = await realpath(rootPath);
  const configBytes = await readFile(await sourcePath(root, configPath));
  const config = validateConfig(JSON.parse(configBytes.toString("utf8")));
  const selected = [...new Set([...config.sources, ...config.characters.map(c => c.profile)])];
  // Read and validate everything before creating a run.
  const inputs = await Promise.all(selected.map(async path => ({ path, bytes: await readFile(await sourcePath(root, path)) })));
  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${config.name}-${randomUUID().slice(0, 8)}`;
  await mkdir(resolve(root, "runs"), { recursive: true });
  const runs = await realpath(resolve(root, "runs"));
  if (!inside(root, runs)) throw new Error("runs directory escapes the repository.");
  const staging = resolve(runs, `.preparing-${randomUUID()}`);
  const destination = resolve(runs, id);
  await mkdir(staging);
  try {
    await mkdir(resolve(staging, "snapshots"));
    await mkdir(resolve(staging, "packets"));
    await mkdir(resolve(staging, "records"));
    const sources: Source[] = [];
    for (const [index, input] of inputs.entries()) {
      const snapshot = `snapshots/${String(index + 1).padStart(3, "0")}.md`;
      await writeFile(resolve(staging, snapshot), input.bytes, { flag: "wx" });
      sources.push({ path: input.path, snapshot, sha256: digest(input.bytes) });
    }
    await writeFile(resolve(staging, "config.original.json"), configBytes, { flag: "wx" });
    const manifest: Manifest = { version: 1, id, createdAt: new Date().toISOString(), runtime: `Bun ${Bun.version}`, mode: "manual", config, sources };
    await writeFile(resolve(staging, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", { flag: "wx" });
    const sourceText = config.sources.map(path => {
      const input = inputs.find(input => input.path === path)!;
      return `## Source: ${path}\n\n${input.bytes.toString("utf8").trim()}`;
    }).join("\n\n");
    const controller = `# Controller packet: ${config.name}\n\n## Purpose\n\n${config.purpose}\n\n## Decisions for this run\n\n${config.decisions.map(d => `- ${d}`).join("\n")}\n\n## Character starting packets\n\n${config.characters.map(c => `- ${c.id}: packets/${c.id}.md`).join("\n")}\n\nRead the starting packets when directing each character. Keep this controller packet private. Follow the included controller instructions and chapter guide. Record directed events, outcomes and editorial changes.\n\n${sourceText}\n`;
    await writeFile(resolve(staging, "packets/controller.md"), controller, { flag: "wx" });
    for (const character of config.characters) {
      const profile = inputs.find(input => input.path === character.profile)!.bytes.toString("utf8");
      await writeFile(resolve(staging, `packets/${character.id}.md`), characterPacket(character, profile), { flag: "wx" });
    }
    await rename(staging, destination);
  } catch (error) {
    // This unique staging directory was created by this call, beneath verified runs.
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
  return destination;
}

export async function record(rootPath: string, runPath: string, actor: string, kind: string, inputPath: string, model?: string) {
  const root = await realpath(rootPath);
  const runs = await realpath(resolve(root, "runs"));
  const run = await realpath(resolve(root, runPath));
  if (!inside(root, runs) || !inside(runs, run) || run === runs) throw new Error("Run must be inside this repository's runs directory.");
  const manifest: Manifest = JSON.parse(await readFile(resolve(run, "manifest.json"), "utf8"));
  if (manifest.version !== 1) throw new Error("Unsupported manifest version.");
  if (!["controller", ...manifest.config.characters.map(c => c.id)].includes(actor)) throw new Error("Unknown actor for this run.");
  if (!["packet", "response", "draft", "note"].includes(kind)) throw new Error("kind must be packet, response, draft or note.");
  const bytes = await readFile(await sourcePath(root, inputPath));
  if (!bytes.length) throw new Error("Cannot record an empty file.");
  const records = await realpath(resolve(run, "records"));
  if (!inside(run, records)) throw new Error("Records directory escapes the run.");
  const createdAt = new Date().toISOString();
  const event = {
    version: 1,
    createdAt,
    actor,
    kind,
    // A packet is addressed to actor; a response/draft/note is authored by actor.
    model: model ?? null,
    sourcePath: inputPath,
    sha256: digest(bytes),
    contentBase64: bytes.toString("base64"),
    text: bytes.toString("utf8"),
  };
  const filename = `${createdAt.replace(/[:.]/g, "-")}-${actor}-${kind}-${randomUUID()}.json`;
  const output = resolve(records, filename);
  await writeFile(output, JSON.stringify(event, null, 2) + "\n", { flag: "wx" });
  return output;
}

const help = `Local story experiment preparation (no model calls)

Run from the repository root:
  bun run experiment prepare --config experiment-config/dog-opening.json
  bun run experiment record --run runs/<id> --actor dog --kind response --from scratch/dog-response.md --model <model-name>

record kinds: packet (addressed to actor), response, draft, note (authored by actor).
Use controller as actor for controller resolutions and edited drafts.
Input files must be within the repository. Each record is a new JSON file; originals are never overwritten.
`;

async function main(args: string[]) {
  if (!args.length || args[0] === "--help" || args[0] === "help") { console.log(help); return; }
  const [command, ...rest] = args;
  if (!["prepare", "record"].includes(command!)) throw new Error(`Unknown command: ${command}`);
  const options: Record<string, string> = {};
  const allowed = command === "prepare" ? ["config"] : ["run", "actor", "kind", "from", "model"];
  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index]?.replace(/^--/, "");
    const value = rest[index + 1];
    if (!rest[index]?.startsWith("--") || !key || !allowed.includes(key) || !value || value.startsWith("--") || key in options) throw new Error("Invalid, duplicate or missing command option. Use --help.");
    options[key] = value;
  }
  const required = (key: string) => {
    if (!options[key]) throw new Error(`Missing --${key}.`);
    return options[key]!;
  };
  if (command === "prepare") console.log(await prepare(process.cwd(), required("config")));
  else console.log(await record(process.cwd(), required("run"), required("actor"), required("kind"), required("from"), options.model));
}

if (import.meta.main) {
  main(Bun.argv.slice(2)).catch(error => {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
