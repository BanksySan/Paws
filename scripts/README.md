# Local experiment CLI

Requires Bun. Run commands from the repository root. This first version prepares files for manually run agents; it makes no API calls and needs no credentials.

```powershell
bun run experiment prepare --config experiment-config/dog-opening.json
```

The command prints a new `runs/<id>` directory. Each run contains:

- `manifest.json`: configuration, runtime, creation time, source paths and SHA-256 hashes.
- `config.original.json`: the exact configuration file used.
- `snapshots/`: exact source and approved-profile bytes, retained even if authoring files change.
- `packets/controller.md`: authoring context and run decisions, for the controller only.
- `packets/dog.md`: the approved Dog profile and starting experience, for a separate Dog agent.
- `records/`: append-only-by-convention contribution files, each with a unique id.

Use a fresh character conversation and paste only its character packet. The controller receives its own packet and can read the starting packets. Subsequent character packets should supply perceptible experience and immediate direction, without disclosing author-only material. The script assembles explicitly chosen context; it does not detect spoilers or guarantee that a manually selected profile is appropriate. Profiles require editorial review.

## Record the exchange

Save each packet or response to a text file inside the repository, for example `scratch/dog-response.md`. Then record it:

```powershell
bun run experiment record --run runs/<id> --actor dog --kind response --from scratch/dog-response.md --model your-model-name
bun run experiment record --run runs/<id> --actor dog --kind packet --from scratch/next-dog-packet.md
bun run experiment record --run runs/<id> --actor controller --kind note --from scratch/resolution.md
bun run experiment record --run runs/<id> --actor controller --kind draft --from scratch/edited-chapter.md
```

Replace `<id>` with the directory name printed by `prepare`. A `packet` is addressed to the named actor; a `response`, `draft` or `note` is authored by that actor. Record resolutions and editorial changes as controller notes. Keep raw responses and edited drafts separate. `--model` is an optional user-supplied label; the script cannot infer model identity or settings from a manual exchange. Record generation settings in a controller note if known.

Every record copies the input text, exact bytes as Base64, checksum and timestamp into its own JSON file. It never edits a previous contribution. Initial packets are retained under `packets/`; record subsequent packets before sending them. These are local files that can still be edited outside the CLI, not tamper-proof storage. Timestamps and unique ids distinguish records; causal order remains the controller's responsibility.

## Configure another experiment

Copy `experiment-config/dog-opening.json`. Change the purpose, decisions, controller-only sources and characters. Source and profile paths are relative to the repository root. Character ids must be unique lowercase slugs other than `controller`.

Each character needs an explicitly reviewed profile and a private starting experience. Add separate characters to the array to prepare separate packets. Complete bibles and beat plans belong in controller sources; they are not automatically sent to characters. The current Dog profile is manually selected from its bible and should be reviewed when the bible changes.

`runs/` and `scratch/` are ignored by Git. To preserve an experiment in the story repository, deliberately copy the reviewed artifacts into `experiments/`. Creating a run does not make it story canon.

## Checks

```powershell
bun test
bun run experiment --help
```

Tests cover context separation, reproducible source snapshots, exact response retention, duplicate runs, invalid configuration and source boundaries. They do not assess narrative quality. Bun executes the TypeScript directly; a separate static type-checking toolchain is not included yet.
