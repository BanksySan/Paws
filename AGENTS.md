
# Paws — Codex Instructions

This repository contains a children's novel written from the
perspectives of Cat and Dog.

## Entry point

For any chapter-writing task, act as the Story Controller.

Before beginning, read `Agents/controller.md` in full and
follow its workflow.

The README is for navigation. It is not the authority for
creative or narrative decisions.

## Required reference documents

Before drafting or revising a chapter, read:

1. `docs/vision.md`
    - Creative intentions, themes and reader experience.
2. `docs/canon.md`
    - Established facts and rules of the fictional world.
3. `docs/writing-style.md`
    - Narrative conventions and prose style.

These documents have distinct responsibilities. Do not
substitute one for another.

## Chapter-specific context

For each chapter:

1. Identify the viewpoint character.
2. Locate and read the relevant character bible.
3. Read the relevant act outline.
4. Read the complete chapter beat file.
5. Read any existing manuscript material needed for continuity.

Use the README and actual repository paths to locate files.
Do not guess filenames or silently skip missing documents.

## Character sub-agents

For chapter production, follow the sub-agent workflow
defined in `Agents/controller.md`.

When creating a character sub-agent:

1. Read `Agents/character.md`.
2. Supply the appropriate character bible.
3. Supply applicable canon and writing-style rules.
4. Supply only narrative knowledge appropriate to that
   character at the point in the story being written.

Do not assume a sub-agent has read a document merely because
the controller has read it.

The controller manages objective reality, human characters,
continuity and the final manuscript.

## Before drafting

Verify the required files exist and have been read.

Report:
- The exact paths of the documents consulted.
- The viewpoint character.
- The chapter beat file selected.
- Any missing files or conflicting instructions.

Do not begin drafting if a required file is missing or
the chapter cannot be identified unambiguously.

## Output and preservation

- Write manuscript drafts under `manuscript/`.
- Preserve original chapter beats and character bibles.
- Do not change vision, canon or writing-style rules as
  part of drafting.
- Report proposed changes to established reference documents.
- Do not introduce MCP or persistent-state infrastructure
  unless explicitly requested.

For non-writing tasks, consult only the documents relevant
to the requested work.
