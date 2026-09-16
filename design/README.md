# RahulSite design — start here

**Canonical design baseline · 16 September 2026 · Draft for owner approval**

| Read order | Document | Purpose |
|---|---|---|
| 1 | [Need and acceptance](need-and-acceptance.md) | End result and measurable release gates: Front end, UI, Backend |
| 2 | [LLD](LLD.md) | Consolidated product, architecture, data, API, UX, security and operations decisions |
| 3 | [Master prompt](master-prompt.md) | Reusable ten-role implementation and review workflow |
| 4 | [Design images](images/diagrams.md) | Four diagrams with rendered SVGs and editable Mermaid sources |
| Reference | [Infrastructure inventory](../infra.md) | Operational resource names, endpoints and historical verification |

## Folder contract

```text
design/
  README.md
  master-prompt.md
  LLD.md
  need-and-acceptance.md
  images/
    network.svg
    sequence.svg
    flowchart.svg
    security.svg
    diagrams.md
```

This folder is inside the app Git repository, so a normal commit/push includes it.
No application folders or original documents were moved or deleted. This avoids
breaking links or losing source history. Do not maintain competing copies here
and at the workspace root. The original workspace documents are retained as
historical source material; future design changes belong here.

## Source consolidation and precedence

| Original source at workspace root | Consolidated destination |
|---|---|
| LLD_PROMPT.md | master-prompt.md: ten original roles, product direction and quality rules |
| PRD.md (not prod.md) | need-and-acceptance.md and LLD product/journey sections |
| HLD.md | LLD architecture, integrations and release model |
| lld.md | LLD contracts, models, states and failure behavior |
| DESIGN_SYSTEM.md | LLD visual tokens, responsive, motion and accessibility specifications |
| backend_implementation.md | LLD backend baseline and acceptance gates |
| implementation_plan.md | LLD implementation order and verification strategy |
| PEEKING_AVATAR_INSTRUCTIONS.md | LLD asset and footer requirements |

Source documents were reviewed against the active code. **Existing** means found
in the repository or the dated infrastructure snapshot, not proven working in
production. **Target** means required work; **Optional** requires separate scope
approval. Acceptance criteria override vague aspirational language. Code proves
current behavior, not that the target has been delivered. Owner-approved design
changes must update the LLD, affected acceptance IDs and diagrams together.

The master prompt is a normal Markdown document to attach or paste into a coding
session; it does not automatically register or launch ten VS Code agents.

## Visual design gallery

Open the SVG links full-size or preview this Markdown document.

### Network — current resources and proposed private networking

![Network architecture](images/network.svg)

### Sequence — target sign-in, upload, publication and reads

![Sequence diagram](images/sequence.svg)

### Flowchart — target visitor and admin journeys

![Application flowchart](images/flowchart.svg)

### Security — trust boundaries and required controls

![Security diagram](images/security.svg)