# AI Research Prompt Pack — Dark Web Threat Actor De-anonymization (NTRO SIH)

**How to use this:** Each section below is a **fully self-contained prompt** — copy everything inside the code block for that section and paste it as-is into a separate AI research tool (ChatGPT, Perplexity, Gemini, Claude, etc.). Each one repeats the project context because the tool you paste it into has no memory of anything else — treat each as a cold start. Run different sections in different tools if you like, or the same tool multiple times. Bring all the outputs back and hand them to me — I'll cross-check, verify, deduplicate, and flag anything that looks fabricated.

**Every prompt below already includes an anti-hallucination instruction. Do not remove it when you paste.** We already caught one fabricated "perfect match" repo in an earlier pass — these instructions exist specifically to reduce that.

---

## Section 1 — Infrastructure Fingerprinting Tools & Techniques

```
CONTEXT: I'm building a system (for a national-level hackathon, for a government intelligence organization) that de-anonymizes dark web threat actors. One capability is: finding misconfigurations in Tor hidden services (.onion sites) — such as exposed server-status pages, SSL/TLS certificates shared with a clearnet domain, default service banners, favicon hash matches, or hidden-service descriptor inconsistencies — and using these to pivot to the real clearnet server/IP hosting the hidden service.

TASK: Research open-source tools, techniques, and existing GitHub repositories that help with this. Specifically cover:
1. Tools that scan a .onion address for OPSEC/configuration leaks (e.g. OnionScan and any modern successors/forks — check which ones actually support Tor v3 addresses, since v2 addresses are deprecated).
2. Favicon-hash-based correlation techniques (how to compute a Shodan-compatible MurmurHash3 favicon hash, and which tools/scripts do this correctly).
3. How to use Shodan, Censys, ZoomEye, and Certificate Transparency logs (crt.sh) to pivot from a leaked fingerprint (banner, cert, favicon hash) to a real IP — include their API basics and any free/academic tier limits.
4. Any other open-source repo that does any part of this.

CRITICAL — ANTI-HALLUCINATION RULES (follow strictly):
- For every GitHub repo you mention, you must have actually seen it in your search results — do not recall repo names from training/memory without a live search confirming they still exist. If you're not sure a repo is real, say "possibly fabricated, please verify manually" instead of stating it as fact.
- Do not state specific version numbers, star counts, or "last commit" dates unless you can see them directly in a source you retrieved. If you don't know, write "unknown — verify directly."
- Do not claim any tool or repo "exactly matches" or "already solves" our full use case — if something looks like a suspiciously perfect match, flag it explicitly as suspicious and say why, rather than presenting it as a great find.
- For every repo, give the actual URL, not a guessed/reconstructed one.

OUTPUT FORMAT: A table with columns: Repo/Tool name + link | What it does | Alive or dead (with evidence) | License | One risk or limitation | Confidence that this repo is real (high/medium/low, and why).
```

---

## Section 2 — Cross-Marketplace Entity Graph (PGP, Wallets, Handles)

```
CONTEXT: I'm building a system (for a national-level hackathon, for a government intelligence organization) that de-anonymizes dark web threat actors. One capability is: mapping threat actors across multiple dark web marketplaces/forums into a single relationship graph, linking identifiers like usernames/handles, PGP public keys, cryptocurrency wallet addresses, and vouch/trust relationships between vendors — with a confidence score on each inferred link.

TASK: Research open-source tools, libraries, and techniques for:
1. Extracting and fingerprinting PGP public keys programmatically (Python libraries, fingerprint comparison).
2. Cryptocurrency wallet clustering heuristics (common-input-ownership heuristic, change-address detection, CoinJoin/mixing detection so we don't wrongly merge unrelated actors) — and any open-source implementations (e.g. GraphSense, BlockSci, or others).
3. Username/handle correlation across platforms (tools like Sherlock, Holehe, h8mail, or similar — confirm what they actually check and whether they're usable as a library, not just CLI).
4. Graph database options for storing this (Neo4j vs. a lighter Postgres/NetworkX approach) and how existing platforms (Maltego, OpenCTI) structure "confidence scores" on relationship edges.

CRITICAL — ANTI-HALLUCINATION RULES (follow strictly):
- For every GitHub repo you mention, you must have actually seen it in your search results — do not recall repo names from training/memory without a live search confirming they still exist. If unsure, say so explicitly.
- Do not state specific version numbers, star counts, or dates unless directly confirmed in a retrieved source.
- If something looks like a suspiciously perfect, complete match to our exact use case, flag it as suspicious rather than presenting it as a clean win.
- Give real, actual URLs only — never reconstruct or guess a plausible-looking URL.

OUTPUT FORMAT: A table with columns: Repo/Tool/Library name + link | What it does | Alive or dead (with evidence) | License | One risk or limitation | Confidence that this repo is real (high/medium/low, and why).
```

---

## Section 3 — Stylometry & AI Persona Linking

```
CONTEXT: I'm building a system (for a national-level hackathon, for a government intelligence organization) that de-anonymizes dark web threat actors. One capability is: using AI-based stylometric analysis (writing-style fingerprinting) and behavioral profiling to detect when a "new" persona on a dark web forum/marketplace is actually a previously known, rebranded threat actor — even when they've abandoned all shared identifiers (no shared PGP key, no shared wallet).

TASK: Research:
1. Classical stylometry techniques (Burrows' Delta, function-word frequency analysis) and any modern, actively maintained open-source Python libraries implementing them.
2. Modern approaches: Siamese neural networks / transformer-embedding similarity (e.g. SBERT-based authorship verification) for short, informal text (forum posts, chat messages) rather than long documents.
3. The "topic bias" problem in authorship verification (models learning to key on subject matter instead of writing style) and any technique/library (e.g. part-of-speech noise injection) used to mitigate it.
4. Any open-source repos implementing dark-web-relevant or short-text authorship verification specifically (not just academic long-document stylometry).
5. Publicly available datasets (academic, ethically sourced) that include forum posts or short-text authorship-labeled data usable for training/testing (e.g. PAN shared-task datasets, Cambridge Cybercrime Centre's CrimeBB).

CRITICAL — ANTI-HALLUCINATION RULES (follow strictly):
- For every GitHub repo or paper you mention, you must have actually seen it in your search results — do not recall names from training/memory without a live search confirming they still exist / are accurately described. If unsure, say so explicitly.
- Do not state specific accuracy/F1 scores, version numbers, or dates unless directly confirmed in a retrieved source — invented-sounding precision (e.g. "achieves 73.9% F1") must be flagged as unverified if you cannot point to where you saw it.
- If something looks like a suspiciously perfect, complete match to our exact use case, flag it as suspicious rather than presenting it as a clean win.
- Give real, actual URLs only — never reconstruct or guess a plausible-looking URL.

OUTPUT FORMAT: A table with columns: Repo/Tool/Paper name + link | What it does | Alive or dead (with evidence) | License | One risk or limitation | Confidence that this is real (high/medium/low, and why).
```

---

## Section 4 — Tor Crawling, OpSec, and Environment Setup

```
CONTEXT: I'm building a system (for a national-level hackathon, for a government intelligence organization) that needs to crawl/scrape content from Tor hidden services (.onion sites) for dark web threat intelligence purposes. The team needs a safe, correctly configured environment and crawling approach — we are NOT going to crawl live active criminal marketplaces (legal/safety reasons); instead we'll test against our own self-hosted onion services, academic datasets, and a few known-benign real onion sites.

TASK: Research and explain, in practical/actionable detail:
1. How Tor v3 hidden service addresses work (Ed25519-based, descriptor structure) at a level useful for someone building a crawler — not deep cryptography, just what a builder needs to know.
2. How to correctly route a Python (requests/Playwright) or Node.js crawler through Tor's SOCKS5 proxy, including the common mistake of using socks5:// instead of socks5h:// (which fails for .onion resolution).
3. The Stem Python library for programmatic Tor circuit control (forcing new circuits, monitoring circuit health).
4. Whonix vs. Tails vs. a plain VM for a research team's crawling environment — practical setup steps and real tradeoffs (not just "use Tor Browser").
5. Any well-known, currently-working open-source Tor crawler/scraper repos (e.g. TorBot, TorCrawl, OnionSearch, or others) — confirm which are still actively maintained and compatible with modern Tor.

CRITICAL — ANTI-HALLUCINATION RULES (follow strictly):
- For every GitHub repo you mention, you must have actually seen it in your search results — do not recall names from training/memory without a live search confirming they still exist. If unsure, say so explicitly.
- Do not state specific version numbers or dates unless directly confirmed in a retrieved source.
- Give real, actual URLs only — never reconstruct or guess a plausible-looking URL.

OUTPUT FORMAT: A short practical guide (not just a table) covering the 5 numbered points above, plus a table of any repos found with columns: Repo name + link | What it does | Alive or dead (with evidence) | Confidence this is real (high/medium/low, and why).
```

---

## Section 5 — Prior Art: Real Case Studies, Academic Research, and Competing Projects

```
CONTEXT: I'm part of a team building a system for a national-level hackathon (Smart India Hackathon, problem statement from India's National Technical Research Organisation, NTRO) that de-anonymizes dark web threat actors by (1) detecting Tor hidden service misconfigurations to find real server IPs, (2) building a cross-marketplace entity graph linking handles/PGP keys/wallets/trust-vouches with confidence scores, and (3) using AI stylometry to detect rebranded/migrated personas. The system needs a dashboard for querying actor profiles, confidence scores, and exporting to CSV/JSON/report formats.

TASK: Research and report on:
1. Real, publicly documented law enforcement case studies where a dark web threat actor was actually deanonymized, and specifically WHAT technical mistake led to it (e.g. the Silk Road/Ross Ulbricht case, AlphaBay/Alexandre Cazes case, Hansa Market takedown — find the specific technical details from court documents, DOJ press releases, or well-sourced journalism, not just the general narrative).
2. Academic papers on Tor hidden service deanonymization, dark web vendor fingerprinting, or cross-marketplace persona migration detection — provide real, findable paper titles/authors/venues, not invented ones.
3. Commercial threat-intelligence products that do something similar (Recorded Future, DarkOwl, Flashpoint, Searchlight Cyber, ShadowDragon) — summarize their PUBLICLY described capabilities from their own websites/whitepapers, not guessed features.
4. IMPORTANT: search specifically for other public GitHub repositories built for this exact Smart India Hackathon problem statement (search terms like "SIH dark web deanonymization", "SIH 26151", "dark web threat actor attribution github", "darkweb OSINT hackathon github") — since other student teams may have published their submissions publicly, and studying a real competing submission's architecture/approach is valuable.

CRITICAL — ANTI-HALLUCINATION RULES (follow strictly):
- Every case study detail, paper citation, or repo you mention must come from something you actually found in search results — do not reconstruct plausible-sounding details from memory. If you're not fully sure a specific detail (a date, a technical mistake, a paper title) is accurate, say "unverified, needs a direct source check" rather than stating it confidently.
- For any repo claimed to already solve most/all of our problem statement, treat this as inherently suspicious and say so explicitly — flag it for manual verification rather than recommending it outright.
- Give real, actual URLs only.

OUTPUT FORMAT: Four short sections matching the four numbered tasks above, each as a bulleted list with sources/links.
```

---

## Section 6 — Dashboard, Data Model, and Confidence Scoring Standards

```
CONTEXT: I'm building a system (for a national-level hackathon, for a government intelligence organization) that de-anonymizes dark web threat actors. The final deliverable needs a queryable dashboard covering: actor profiles, identifiers (handles/PGP keys/wallets), hidden service infrastructure indicators, persona linkages, an "attribution confidence" score, category, last-scan date, and source — queryable across a timeline, with export to CSV, JSON, and report formats.

TASK: Research:
1. STIX 2.1 (Structured Threat Information eXpression) — what it is, its core object types (Threat Actor, Indicator, Relationship, etc.), and whether/how it could be adapted as our data model, even if we don't build a full STIX-compliant platform.
2. How existing platforms (OpenCTI, Maltego, MISP) represent "confidence scores" on inferred relationships/links between entities — what scale they use, how they combine multiple weak signals into one score (e.g. probabilistic fusion methods like Noisy-OR, or simpler weighted scoring).
3. Practical open-source graph visualization libraries/frameworks suitable for a web dashboard (e.g. for rendering an entity-relationship graph in a browser) — compare 2-3 real options with tradeoffs.
4. Best practices for CSV/JSON export design for investigative/intelligence tools (what fields are typically included, how confidence/provenance is represented in exports).

CRITICAL — ANTI-HALLUCINATION RULES (follow strictly):
- For every tool, library, or platform you mention, you must have actually seen it in your search results — do not recall names from training/memory without confirming they still exist/are accurately described. If unsure, say so explicitly.
- Do not invent specific scoring formulas or claim a platform "uses X algorithm" unless you found this stated directly in a real source — if you can't confirm the specific method, describe it as "commonly used approach in the field" rather than attributing it to a specific product without evidence.
- Give real, actual URLs only.

OUTPUT FORMAT: Four short sections matching the four numbered tasks above, with sources/links and a short table for the graph visualization comparison.
```

---

## After you run these

Send me back whatever each tool produces (paste the raw output, don't pre-summarize it yourself — I want to see the actual claims so I can verify them). I'll then:
1. Independently verify anything that seems load-bearing (repo existence, case study accuracy, tool claims) via direct search/fetch.
2. Deduplicate across all 6 sections' results.
3. Flag anything that still looks fabricated despite the anti-hallucination instructions (they reduce but don't eliminate the risk).
4. Turn the verified survivors into the actual architecture and build plan.
