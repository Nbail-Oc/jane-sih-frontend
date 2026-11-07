# Research Task: Prebuilt Open-Source Repo Hunt

**Goal:** Find existing open-source GitHub repositories that already do *some part* of what we're building, so we can reuse, fork, or learn from them instead of building everything from scratch — the way we found "Robin" for the dark-web search+scrape+LLM-summary layer.

## What we're building (context, don't skip this)
A system that de-anonymizes dark web threat actors via three capabilities:
1. **Infra fingerprinting** — finding misconfigured Tor hidden services (exposed status pages, reused TLS certs, banner leaks, descriptor inconsistencies) and pivoting to the real clearnet server.
2. **Cross-marketplace entity graph** — linking handles, PGP keys, wallets, and vouches/trust-links across multiple marketplaces/forums into one relationship graph with confidence scores.
3. **AI persona linking** — stylometric/behavioral matching to detect when a rebranded/migrated persona is actually a previously known actor.
Plus: a dashboard to query all this by timeline, actor, category, confidence — with CSV/JSON/report export.

## Your task
Search GitHub (and GitHub-adjacent places like Awesome-lists, Reddit r/OSINT, security blogs linking to repos) for **any repo that does at least a piece of the above**, even a small piece. Cast a wide net — quantity of leads matters more than pre-filtering at this stage.

Search terms to try (don't limit yourself to these):
`dark web osint`, `tor deanonymization`, `onion scanner`, `dark web crawler`, `dark web scraper`, `pgp key osint`, `crypto wallet clustering`, `stylometry python`, `authorship attribution`, `entity resolution graph`, `threat actor attribution`, `dark web marketplace scraper`, `tor hidden service fingerprint`, `favicon hash osint`, `dark web monitoring open source`

## For every repo you find, report back in this format:

**Repo name + link:**
**Which pillar(s) does it touch?** (1 = infra fingerprinting / 2 = entity graph / 3 = stylometry / Dashboard / Other-utility)
**What does it actually do?** (2–3 sentences, based on reading the README *and* skimming the actual code — not just the README's marketing description)
**Is it alive?** (last commit date, open issues activity — dead repos are still useful as reference, just flag them as dead)
**Can we use it directly, fork it, or just learn from its approach?** (pick one + one line why)
**License?** (make sure it's actually reusable — MIT/Apache/BSD are easy; GPL needs a note; no license file = don't assume you can use it)
**One risk/limitation worth flagging** (e.g. "only supports v2 onions," "requires a paid API key," "scrapes real live marketplaces which we've decided not to do")

## Do NOT
- Do not run/execute any repo yet — this pass is read-only research (README + code skim). We'll decide what to actually install/test after reviewing everyone's findings.
- Do not include tools whose only real function is accessing/scraping live illegal marketplaces for content (that's a decision we're not making at the repo-hunt stage).
- Don't over-filter — a repo that only does 10% of one pillar is still worth reporting; we'll judge usefulness centrally.

## Deliverable
A simple list (table or bullet list, your choice) of every repo found, each filled out per the format above. Send it back as-is — no need to pre-narrow the list yourselves, that's the next step we'll do together.
