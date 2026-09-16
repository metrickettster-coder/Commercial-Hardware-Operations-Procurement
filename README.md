# Hardware Operations Analytics Suite

A free, single-file, browser-based calculator suite for hardware supply chain, procurement, NPI, and manufacturing quality professionals.

**Live:** https://commercial-hardware-operations-procurement.metrickettster.workers.dev/

44 tools across 7 pillars of the hardware product lifecycle:

1. **Concept & Feasibility** — TAM/SAM/SOM, NPV/IRR, design-to-cost, technical risk scoring
2. **NPI & Stage-Gate Launch** — stage-gate exit, EVT/DVT/PVT build yields, ECO impact triage, FAT/SAT, standards & compliance, DFMEA
3. **Sourcing & Costing** — landed cost, freight mode comparison, should-cost modeling, multi-quote comparison, make-vs-buy, duty drawback
4. **Ops & Quality Execution** — EVM, EOQ, demand forecast accuracy, OEE, PO acknowledgment & expediting, three-way match / invoice variance
5. **Sustaining & EOL Closeout** — RMA/warranty risk, alternate-part qualification, EOL/last-time-buy planning
6. **Supplier & Risk Mgmt** — supplier qualification, performance scorecards, risk register, Kraljic matrix, contract renewals, supplier audits
7. **Quality & Reliability Engineering** — Cp/Cpk, FMEA/8D, factory defect Pareto/RCA, MTBF/reliability

## How this got built

Every tool here started from the same process: read real job postings across hardware supply chain, procurement, NPI, and manufacturing quality roles, find a gap between what the role actually needs day-to-day and what existing free tools cover, then build a calculator to close it. See [CHANGELOG.md](./CHANGELOG.md) for what's shipped and when.

## How it works

- **Single HTML file.** No build step, no backend, no database — `index.html` is the entire app.
- **100% client-side.** Every calculation runs in your browser. Uploaded quotes/specs are parsed locally and never sent anywhere.
- **Save/Load Scenario** exports your work as a portable JSON file; autosave keeps a copy in your browser's local storage.
- **CSV and PDF export** roll up every tool into one report.
- Deployed on Cloudflare Workers ([wrangler.jsonc](./wrangler.jsonc)); each tool has its own URL (`/pillar/tool`) for direct linking.

## Stack

Vanilla HTML/CSS/JS. PDF/DOCX parsing via [pdf.js](https://mozilla.github.io/pdf.js/) and [Mammoth.js](https://github.com/mwilliamson/mammoth.js/), loaded from cdnjs. PDF export via [html2pdf.js](https://github.com/eKoopmans/html2pdf.js).

## Contributing / feedback

Use the in-app Feedback button, or open an issue.
