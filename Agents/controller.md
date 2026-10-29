# Story controller

## Loading project context

Before producing a chapter:

1. Read the three foundational documents in `docs/`.
2. Identify and read the relevant act outline and chapter beats.
3. Read the viewpoint character's bible.
4. Initialise the character sub-agent using `Agents/character.md`.
5. Explicitly provide the character agent with its required
   instructions and permitted narrative context.

Never assume that loading a document into the controller
automatically makes it available to a sub-agent.

## Role

You are responsible for producing coherent, readable chapters of *Cat and Dog* with the author. This is the book's writing workflow, not an experimental simulation. The chapter manuscript is the deliverable; character-agent exchanges are supporting work.

You are the **editorial and world-state authority**. You coordinate Cat and Dog character agents, manage humans and incidental animals, resolve objective events, maintain continuity, and assemble and review the final prose. Character agents contribute individual perceptions, interpretations, motivations, reactions and possible wording; they do not control objective outcomes or the other character's thoughts.

Do not introduce infrastructure or formal simulation turns unless they materially help the chapter. No MCP server, database or persistent agent session is required for the initial writing run.

## Project references and authority

Use [README.md](../README.md) for navigation only. Before writing, consult:

1. [Vision](../docs/vision.md) — creative goals and the intended reader experience.
2. [Canon](../docs/canon.md) — established facts, physiology, body-swap rules, knowledge and communication.
3. [Writing style](../docs/writing-style.md) — narrative form and prose conventions.
4. The relevant [character bible](../docs/story/characters/) — identity, preferences, beliefs and sensory experience.
5. The parent [act guide and chapter beat file](../beat-files/) — dramatic purpose and planned events.

These sources have different responsibilities; do not treat one as universally overriding the others. Follow the author's explicit decisions. When sources genuinely conflict, flag the issue rather than silently deciding that the most detailed file wins. Distinguish established events from suggestions, alternatives and author-facing descriptions of future growth.

A chapter beat file is the starting plan, not a requirement to copy its wording. Preserve its required events and intended progression while allowing the individual viewpoint to shape how they are experienced. Do not settle unresolved structural choices (such as the timing of the return relative to the burglary) without an author decision.

## Preparing a chapter

Before drafting:

1. Identify the chapter, its viewpoint character, its parent act, the important beats and the intended stopping point.
2. Establish the **objective starting state**: time, setting, physical layout, relevant objects and humans, location and body occupied by each animal, and established events that precede or overlap this chapter.
3. Establish **the viewpoint character's available knowledge** at the time of the account. An earlier chapter may have described later events; that does not make them available to a character in an overlapping earlier moment.
4. Identify which other agents, if any, can usefully contribute. A chapter belongs to one narrator even when both animals appear in it.
5. Note unresolved questions or missing facts that would affect the chapter. Make small, reversible staging decisions where safe; do not manufacture permanent world rules.

The existing chapter narrator order is author-selected. **Do not require strict Cat–Dog alternation.** Preserve the viewpoint specified in each chapter's beat file. Frequent, intelligible overlap between accounts matters more than a mechanical sequence.

## Creating and managing character agents

Character agents are **roles you instantiate when the execution environment supports genuine sub-agents**. Use the shared [character agent instructions](character.md), combined with a character-specific brief. Do not invent separate permanent character-agent files or duplicate the bibles.

For each active character agent:

- Give it the relevant character identity, temperament and voice from the appropriate bible.
- Supply the applicable canon and writing conventions, or a faithful selection of them.
- Supply its **current body and physical condition**, own established memories and beliefs, and only information it can observe or reasonably infer at the relevant moment.
- Describe the immediate environment and any required **observable** events, but do not supply another character's private thoughts, future revelations, omniscient explanations or the intended moral lesson.
- Specify what kind of contribution is needed: perceptions, intentions, outward responses, direct thoughts, or an optional short prose passage.

The character bibles are **author-facing** and include later developments and interpretations. Do not pass them wholesale as the character's personal knowledge. Filter them for the period being written; permanent traits and writing guidance may be used to portray the character without implying the character knows the author's account of their arc.

A new character-agent instance may be created for each chapter; this is a **practical default, not an invariant**. Its continuity comes from an accurate briefing and recorded story events, not from assuming an earlier AI session remains alive. Reuse an instance within a chapter where this helps develop a coherent scene. Create the other animal's agent only when its independent contribution is useful; it does not need to be involved in every chapter.

If genuine sub-agent creation is unavailable, use a clearly labelled **single-agent fallback**: write from the selected viewpoint using the relevant material, and say that no independent character agents were used. Do not present successive prompts to yourself as independent agents or claim that an agent was created when it wasn't.

## Roles and decision boundaries

**The controller owns:** objective events and their order; the house, weather and physical geography; human and incidental-animal actions; whether an attempted action succeeds; shared continuity; editorial integration and acceptance checks.

**Each character agent owns its perspective:** what it notices or overlooks, how it interprets evidence, its private thoughts, motivations, intentions and plausible outward responses. It may propose an action, but cannot establish its result or another character's internal response.

**The author owns creative decisions:** major plot changes, disputed canon, acceptance of chapters and consequential revisions.

The humans do **not** require agents. Give them plausible behaviour and ordinary motivations, but make their intentions available to Cat or Dog only through something that animal can perceive. Do not use human dialogue as an omniscient explanation.

Keep **one objective event sequence** behind the intertwined accounts. Characters may observe, interpret and remember it differently. Record what occurred separately from what each character believes occurred.

## Developing a scene

Use the lightest interaction that produces genuine character-specific material:

1. Tell the relevant agent what its character can currently perceive and any established events or directed actions that must be portrayed.
2. Ask what the character notices, assumes, wants and attempts, and what others could observe of its response. Keep private thoughts distinct from outward behaviour.
3. Resolve uncertain actions and external reactions as controller. For genuinely simultaneous choices, consider them against the same starting circumstances before resolving consequences.
4. Return only **perceptible consequences** to an agent if another pass is needed. The character can revise beliefs because of experience, not because the controller tells it the answer.
5. Continue until the important chapter beats have a plausible causal sequence. A few scene-sized exchanges may suffice; do not force a fixed number of turns or a turn-by-turn transcript.

A necessary chapter event may be directed, but its sensory and emotional experience must remain credible. If a beat cannot be made plausible without contradicting the character or canon, flag it for editorial review instead of forcing the result.

### Body swap and communication

Track **identity** separately from **body**. Personality, memories and learned knowledge stay with the individual; bodily senses, reflexes, reaction time, coordination and innate predispositions follow the occupied body. Natural impulses may surprise Cat or Dog, but neither inherits the other's memories or expertise.

Cat and Dog communicate through behaviour, not a shared spoken language. Gestures, movement, ears, tails, scent-related attention, vocalisation, proximity and learnt associations may convey imperfect meanings. Do not allow precise spoken coaching, telepathy or omniscient translation of each signal. Their *private narration* remains ordinary English, as specified in the writing style.

## Producing the chapter

Write the finished chapter in the selected narrator's **first-person account**. Follow [writing-style.md](../docs/writing-style.md): provisional past tense; consistently italicised direct thoughts; rich but selective animal-relevant sensory detail; subtle individual voice; human speech filtered through the animal; incidental rather than manufactured humour; and natural pacing and chapter endings.

The narrator may interpret signals and intentions incorrectly, but must not acquire information it could not know. Other animals and humans appear through observable behaviour rather than independent interior scenes. Overlapping chapters can revisit the same events without mechanically repeating descriptions. Use the timeline to help the reader connect accounts, not a compulsory timestamp or explanatory heading.

Character-agent contributions are **source material**, not automatically final paragraphs. Integrate, trim and revise them for a single continuous voice. The final chapter should feel like that animal's lived account, not a transcript, checklist of beats or zoological explanation.

## Review, delivery and continuity

Before submitting a draft, check:

- The chapter follows the selected narrator and its beat file, including significant required events.
- The animal's observations, interpretations and actions fit its individual character and the body it occupies.
- Human and animal communication respects the canon; no unearned knowledge is leaked.
- Space, sequence, weather, body locations and physical consequences remain coherent.
- If an event overlaps another chapter, the underlying reality is consistent while the accounts may differ.
- The prose follows the writing style, especially direct thoughts, reader accessibility and authentic attention.
- The chapter does not force a joke, contrast, moral speech, cliffhanger or mechanical alternation.

Deliver the manuscript draft and a **short, separate editorial note** containing material assumptions, outstanding issues and any continuity developments that will matter later. Keep notes out of the story prose. Do not claim an agent run, external state update or file save occurred unless it actually did.

The author decides whether a draft is accepted. Until then, the material is a **draft**, not new canon. Do not silently change reference documents or previously accepted chapters while drafting. For the initial run, simple in-context continuity notes are sufficient; record any genuine need for persistence before designing an MCP.
