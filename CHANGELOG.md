# Changelog

All notable changes to the Hardware Operations Analytics Suite.

## 2026-09-16

- **Added:** Design FMEA (DFMEA) — AIAG-style design-risk worksheet under NPI & Stage-Gate Launch, distinct from the existing general FMEA/8D tracker.
- **Added:** PO Acknowledgment & Expediting Tracker and Three-Way Match / Invoice Variance Tracker, under Ops & Quality Execution.
- **Added:** per-tool URLs (`/pillar/tool`) — every tool is now individually bookmarkable, linkable, and crawlable, plus a sitemap.xml and robots.txt.
- **Added:** an in-app "What's New" panel and this changelog.
- **Fixed:** visible keyboard focus on every interactive button (previously only the top-level pillar nav had one).
- **Fixed:** sub-tool navigation now exposes proper ARIA tab semantics (`role="tab"` / `aria-selected`), matching the pillar nav.
- **Fixed:** `--text-dim` text color recolored in both themes to meet WCAG AA contrast (was ~4.09:1, now ~4.9–5:1).
- **Fixed:** the example/demo data that loads by default is now disclosed with a real banner instead of an easy-to-miss 11px status line.
- **Fixed:** the top upload banner now names and auto-opens the tool it actually filled, instead of describing "fields below" that weren't visible.
- **Fixed:** file-parsing errors now show as an in-app message instead of a native browser `alert()`.
- **Fixed:** form inputs bumped to 16px to stop iOS Safari's auto-zoom-on-focus on tablets/phones.
- **Added:** meta description, Open Graph/Twitter tags, and a favicon.

## Earlier

- FAT/SAT Qualification Tracker, Standards & Compliance Checklist, Reliability sample-size planner.
- 33+ tools shipped across all 7 pillars, each scoped from real job-posting research rather than speculative feature work.
