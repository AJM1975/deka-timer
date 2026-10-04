# RaceSplit Project Hub

RaceSplit is a mobile-first multi-event timing app for DEKA-style and custom fitness events.

**Live domain:** https://racesplit.app  
**Repository:** https://github.com/AJM1975/deka-timer

## Current status

**Stage:** Early working product / MVP

### Working now
- DEKA MILE template
- DEKA FIT template
- DEKA STRONG template
- Custom event builder
- Current split timer shown alongside accumulated race time
- Optional run tracking
- Optional transition tracking
- Editable splits for early/late taps
- Undo and pause controls
- Saved event templates
- Save As workflow from built-in templates
- Race history saved on the device
- CSV and JSON export
- Custom domain configured: racesplit.app

## Current focus

1. Finish RaceSplit branding throughout the app.
2. Add target splits and live ahead/behind comparison.
3. Improve template management and custom event setup.
4. Make the app installable/offline as a PWA.
5. Improve results comparison across repeated attempts.
6. Test race-day usability on mobile.

## Project areas

| Area | Purpose |
|---|---|
| [Roadmap](ROADMAP.md) | What is next and what is later |
| [Architecture](ARCHITECTURE.md) | How the app is structured |
| [Decision Log](DECISIONS.md) | Why key product decisions were made |
| [Release Notes](RELEASES.md) | Changes shipped over time |

## Working rules

- Built-in race templates stay locked.
- A user can start from a built-in template and **Save As** a custom event.
- Historical results store a snapshot of the event used at the time.
- Race timing must remain usable with one hand and minimal taps.
- Mistakes must be recoverable without restarting a race.
- Avoid DEKA-specific assumptions in the core timing engine so RaceSplit can support other event formats.

## Backlog categories

Use GitHub Issues for individual pieces of work and prefix titles with:

- **Feature:** new functionality
- **Enhancement:** improvement to something existing
- **Bug:** something not working correctly
- **UX:** race-day usability or design
- **Tech:** architecture, performance or deployment
- **Idea:** not yet committed to the roadmap

## Definition of done

A change is done when:
- it works on mobile,
- it does not break saved templates/results,
- race timing remains accurate after correction/undo,
- the change is committed to GitHub,
- and the release notes are updated when user-facing.
