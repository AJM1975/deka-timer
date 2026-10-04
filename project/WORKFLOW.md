# RaceSplit Product Workflow

This is the operating model for RaceSplit.

## 1. Capture

Use a GitHub Issue for anything that may require work.

Choose:
- **Idea** — something worth exploring.
- **Feature** — a new capability or enhancement we intend to define.
- **Bug** — something that is broken or incorrect.
- **UX** — usability improvement, normally created as a Feature issue.
- **Tech** — architecture, deployment, performance or maintenance work.

Do not worry about having the solution when logging an issue. Capture the problem first.

## 2. Understand

Before coding, clarify:
- what problem are we solving?
- who experiences it?
- what does success look like?
- does it affect timing accuracy?
- does it alter event/template data?
- could it damage historical results?
- does it make race-day operation easier or harder?

For larger changes, record the chosen approach in `DECISIONS.md`.

## 3. Define

Turn the issue into clear acceptance criteria.

For timing changes, explicitly define:
- when the clock starts/stops,
- how splits are calculated,
- what undo does,
- what editing/correction does,
- what is persisted,
- what is exported.

## 4. Build

For small, approved changes:
1. update the code,
2. commit to `main`,
3. GitHub Pages deploys production automatically.

For larger/riskier changes, prefer:
1. create a feature branch,
2. implement,
3. review/test,
4. merge to `main`.

## 5. Verify

Before closing:
- test on mobile,
- confirm the core timer still works,
- test undo/correction if timing code changed,
- test saved templates/history if data structures changed,
- check `racesplit.app` after deployment.

## 6. Document

Update as appropriate:
- `ROADMAP.md` — priorities.
- `ARCHITECTURE.md` — system/data structure.
- `DECISIONS.md` — important product/technical decisions.
- `RELEASES.md` — shipped user-facing changes.

## 7. Close

Close the issue only when production is verified, or mark it not planned if deliberately rejected.

---

## How to use this with ChatGPT

In the RaceSplit ChatGPT project you can say things like:

- "Log this as an idea: ..."
- "Create a bug for ..."
- "Work through issue #12 and recommend a solution."
- "Build issue #12."
- "Deploy the change."
- "What should we work on next?"
- "Show me the current RaceSplit backlog."

When asked to build an approved item, ChatGPT can use the GitHub repository directly to inspect the current code, implement the change, commit it, and update the issue/project documentation when the available GitHub connection permits it.

## Production

- Repository: https://github.com/AJM1975/racesplit
- Production: https://racesplit.app
- Branch: `main`
- Hosting: GitHub Pages
- Analytics: Cloudflare Web Analytics
