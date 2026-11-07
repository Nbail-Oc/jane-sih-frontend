# Dark Web Threat Actor De-anonymization — Team Research Brief

This is a divide-and-conquer research brief. Assign owners per section. Each owner should come back with: (1) what exists, (2) what's usable/reusable, (3) licensing/legal notes, (4) a short recommendation.

---

## 0. Operational Setup — Decide This First

**Question you asked: laptop, VM, or Tails? Does my IP stay secure?**

Straight answer: **none of these fully "secure your IP" by themselves** — what matters is which layer you're trusting.

| Setup | What it actually protects | What it does NOT protect |
|---|---|---|
| Bare laptop + Tor Browser only | Traffic content, basic fingerprinting | Your host OS is still exposed to anything that breaks out of the browser sandbox; your normal Wi-Fi/ISP still sees "this IP is talking to Tor guard nodes" (not what you're doing, but *that* you're doing it) |
| VM (VirtualBox/VMware) running normal OS + Tor | Isolates crawler crashes/malware from your main machine | VM can still leak your real IP via DNS misconfig, VPN not applied to VM's virtual NIC, clock skew fingerprinting, if you're sloppy |
| **Tails OS** (live boot from USB, amnesic) | Forces *all* traffic through Tor at the OS level, leaves no trace on the host after shutdown, resistant to a lot of local forensics | Still doesn't hide "an IP is connecting to Tor" from your local network/ISP; doesn't protect you if your *code itself* leaks something (e.g., a script that also opens a non-Tor socket, or a Playwright browser not actually routed via the proxy) |
| **Whonix** (two-VM setup: Gateway + Workstation) | Workstation VM has *no* route to the internet except through the Gateway VM, which forces Tor — so even a bug in your own crawler code can't accidentally leak your real IP, because there's no path to leak through | More setup complexity |

**Recommendation for your team:** Use **Whonix** (or Tails if you want simplicity over flexibility) for anything that touches even benign `.onion` addresses, run entirely inside a VM on a machine you don't mind wiping, and additionally connect your host machine to a VPN before Tor even starts (so if anything *does* leak, it's the VPN's IP, not your home/college IP — "VPN over Tor" vs "Tor over VPN" is itself a debate; for your defensive research purposes, a VPN as an outer layer is the simpler/safer default). This is genuinely a best practice even though we already decided you're not crawling live criminal marketplaces — because your self-hosted test onion, benign onions, and any accidental cross-links deserve the same discipline you'd want to demo to NTRO judges as "how a real operational team would work."

**Research task:** Have someone set up Whonix or Tails in a VM this week purely as an environment exercise — get a `.onion` reachable, confirm via `check.torproject.org`-equivalent that you're actually on the network, before writing any crawler code.

---

## 1. How Do You Actually Scrape Tor? (the pattern)

The pattern, end to end:

```
Your crawler code (Python/Node)
   → SOCKS5 proxy (socks5h://127.0.0.1:9050, from local `tor` daemon)
   → Tor circuit (3 relays + rendezvous point for .onion, no exit node involved for .onion targets)
   → Hidden service
```

Key implementation details to research/test:
- **`socks5h` vs `socks5`**: the `h` means "resolve hostnames remotely" — mandatory for `.onion`, since your local machine cannot resolve them at all (they're not real DNS names).
- **`torrc` config**: you'll want `ControlPort 9051` and a hashed control password enabled so **Stem** can talk to the Tor process to force new circuits (`NEWNYM`), check circuit build status, and read consensus/descriptor data.
- **Rate limiting / circuit rotation**: hitting the same hidden service too fast from the same circuit looks abnormal and some services rate-limit or serve CAPTCHAs. Research how Tor circuit lifetime (~10 min default) interacts with your crawl frequency.
- **Descriptor fetching**: v3 onion addresses are derived from an Ed25519 public key; the hidden service publishes a "descriptor" to specific HSDir (hidden service directory) relays in the network, and Tor clients fetch it to learn the introduction points. Understanding this matters for the infra-fingerprinting pillar (descriptor inconsistencies were explicitly named in the PS) — research the Tor spec section (`rend-spec-v3.txt`) on descriptor format.

---

## 2. Onion Search Engines & Discovery Tools

You need a way to *find* `.onion` addresses to test against (for benign targets) and to understand how discovery works generally:

- **Ahmia** (`ahmia.fi`) — the main clearnet-accessible onion search engine, explicitly filters CSAM, indexes only what's crawled and deemed indexable. Good research subject: read their crawler's approach (open source, on GitHub as `ahmia-index`/`ahmia-crawler`) — it's a legitimate, well-documented reference crawler architecture.
- **OnionLand Search, Torch, DuckDuckGo's onion mirror** — for understanding what a "search layer" over Tor looks like.
- **Tor2web-style proxies** — clearnet gateways to onion content (research only, do not build your demo dependency on these; several are unreliable/questionable).

**Research task:** Pull Ahmia's crawler source and read how it handles URL discovery (following links found on indexed pages), de-duplication, and its exclusion/blocklist approach for illegal content categories — this is directly relevant to how *you* should scope your own crawler's target list responsibly.

---

## 3. Existing Open-Source OSINT Tools — Survey List

Yes — search GitHub for these and actually read the source, not just the README, since several are old/abandoned and you need to know if they still work with v3 onions and modern Tor:

| Tool | What it does | Relevance |
|---|---|---|
| **OnionScan** (l1am0/onionscan or successor forks) | Scans a hidden service for operational security mistakes — SSH keys, exposed status pages, identical file hashes across services | **Direct prior art for Pillar 1** — read this first, in depth |
| **OnionIngestor / OnionSearch** | Automated .onion discovery + scraping across known search engines | Discovery layer reference |
| **TorBot** | OSINT crawler for onion links, extracts emails, and basic metadata | Simple crawler reference, check how current it is |
| **Fresh Onions / OnionScrape (various forks)** | Crawl + database + basic classification of onion content | Pipeline architecture reference |
| **Maltego** (with dark web transforms/plugins, some community-built) | Entity-relationship graphing tool, closed-source core but has a free Community Edition | **Direct prior art for Pillar 2** — study how it visualizes confidence-weighted links between entities |
| **SpiderFoot** | General OSINT automation framework, has modules for breach data, PGP, crypto wallets | Good reference for how to structure a modular "collector" architecture |
| **CrimeBB / Cambridge Cybercrime Centre tools** | Academic forum-scraping + analysis pipeline, published methodology papers | Directly usable dataset + methodology for Pillar 3 |
| **DARKINT / darkweb-scraper repos** (search broadly, many small student/research projects) | Mixed quality, but good for seeing common architectural patterns and common mistakes | Survey 5–10 of these quickly, don't rely on any single one |

**Research task:** Assign 2 people to each read OnionScan's actual detection logic (it's Go, but the logic is readable) and Maltego's approach to link confidence — write a 1-page summary of "what specific signal did they check, and how did they score it."

---

## 3B. Specific Tools to Research — What to Look For in Each

Don't just "install and try" these — for each one, answer the same four questions: **(1) what does it actually do, (2) can we call it programmatically or only via UI, (3) what's the licensing/cost model, (4) which specific piece of our pipeline could it slot into or inspire.**

### Infrastructure / Pillar 1 candidates

| Tool | What to specifically research |
|---|---|
| **Shodan** | API structure (`shodan.io/api`), what banner/favicon-hash/cert search actually returns, whether the academic/student API tier gives enough query volume for a demo, and specifically the **favicon hash (`http.favicon.hash`) search operator** — this is the single most reusable trick for Pillar 1 |
| **Censys** | Same as Shodan but check their **certificate search** specifically (`censys.io/certificates`) — compare result quality/API limits against Shodan so you can decide whether to use one, both, or fall back to raw `crt.sh` queries |
| **ZoomEye** | Chinese equivalent of Shodan — research whether it indexes infrastructure Shodan/Censys miss (useful if your synthetic/test targets end up hosted in regions ZoomEye covers better) |
| **SecurityTrails** | Passive DNS history API — research how you'd use this once you have *one* leaked clearnet IP/domain, to pull its historical hosting record and catch a provider that later reused the IP for the onion's backend |
| **crt.sh (Certificate Transparency)** | Not a "tool" so much as a public log — research its SQL query interface (it's a Postgres-backed public database you can query directly) for pulling every cert ever issued for a suspected clearnet domain, and how to script this instead of using the web UI |

### Entity / graph / Pillar 2 candidates

| Tool | What to specifically research |
|---|---|
| **Maltego** | Whether Community Edition's node-count cap is workable for your demo graph size; more importantly, study their **"Transform" architecture** — a Transform is just "given an entity, return related entities" — this is the exact abstraction you should copy for your own entity-resolution engine, regardless of whether you use Maltego itself |
| **Lampyre** | Compare its graphing/timeline UI against Maltego's — research whether its free tier covers crypto wallet clustering (Lampyre has some built-in blockchain analysis modules, which is directly relevant to your wallet-linking logic) |
| **Sherlock** | Confirm it's still maintained against the current username-check-site list (these break often as sites change), and check if it's importable as a Python library vs. only CLI — you'll want to call it programmatically from your pipeline, not manually |
| **Holehe** | Same check as Sherlock but for email-based account enumeration — research its detection method (many sites leak "this email is registered" via password-reset-flow differences) since that logic pattern itself is reusable if you need to write a custom checker later |
| **h8mail** | Research which breach-data backends it hits by default (HaveIBeenPwned API requires a paid key now — check current pricing/free-tier status) and whether a free/local alternative breach corpus would work better for your demo instead of live API calls |
| **Ignorant** | Narrow-scope but check its phone-to-social-account method — mostly useful as a secondary enrichment step, low priority |
| **Epieos** | Research its email-to-Google-account-enumeration method (it uses Google's own account-recovery flow signals) — same "signal from a side-channel" pattern is worth understanding conceptually even if you don't call it directly |
| **Intelligence X** | Research their API (not just the web search) — specifically whether their historical breach/leak archive can be queried programmatically for a given handle/email/PGP key, which would be a strong "known identifier already seen elsewhere" enrichment signal |
| **ShadowDragon** | You won't get access — research their **public case studies and product one-pagers** instead, specifically how they describe "identity resolution" and "network mapping" outputs, purely to borrow terminology/feature framing for your own report and dashboard copy |

### Automation / collection framework candidates

| Tool | What to specifically research |
|---|---|
| **SpiderFoot** | This is your strongest candidate as an actual backbone. Research: (1) how to write a **custom SpiderFoot module** (their module API), since you'll likely want custom modules for PGP-key extraction and onion-specific fingerprinting that don't exist yet, (2) whether SpiderFoot HX (cloud) vs open-source SpiderFoot (self-hosted) matters for you — stick to open-source, (3) how it stores results (SQLite by default) and whether that's queryable enough for your dashboard or whether you'll pipe results into your own DB instead |
| **Recon-ng** | Research mainly as a comparison point to SpiderFoot — check its last meaningful commit date/community activity before considering it as your backbone; likely conclusion is "reference only, build on SpiderFoot instead" but confirm rather than assume |
| **Creepy** | Low priority — research only if your team decides to add a geolocation-from-metadata angle; otherwise skip |
| **TorBot / OnionSearch / thedevilseye** | Small existing onion-crawling utilities — research each one's actual crawl method (some, like "thedevilseye," explicitly work *without* a live Tor connection by scraping clearnet mirrors/search engines of onion listings — check whether that limits what data you can get vs a true Tor-routed crawl) |
| **Robin** (apurvsinghgautam/robin) | AI-powered dark web OSINT tool — Tor-routed search + scrape + LLM summarization + conversational follow-up + pivot suggestions, Streamlit UI, Docker-packaged. **Does not cover any of the 3 attribution pillars** (no infra fingerprinting, no entity graph, no stylometry) — it's a discovery/triage front-end only. Research: (1) read `scrape.py`/`search.py` to see which onion search engines it queries and how it handles Tor connection failures — reusable plumbing, (2) study its query-refinement → filter → summarize → follow-up pattern as UX inspiration for your dashboard's timeline-query feature, (3) decide whether to fork/wrap it as your discovery-layer component or just borrow the architecture pattern |

### Environment / OpSec

| Tool | What to specifically research |
|---|---|
| **Whonix** | Two-VM (Gateway + Workstation) install process on your actual hardware, and specifically how to run Playwright *inside* the Workstation VM reliably (headless browser resource use inside a VM can be heavy — test this early, not the night before demo) |

### Forums (research the *reporting about* them — do not access directly, see §1 caution above)

| Forum | What to specifically research |
|---|---|
| **XSS, Exploit.in** | Pull 2–3 recent Recorded Future / Flashpoint / KELA / Group-IB threat reports that describe these forums' structure — specifically how vendor reputation, escrow, and vouching are displayed, since that's exactly the metadata schema your Pillar 2 entity model needs to represent |
| **Dread** | Research its role as a marketplace-adjacent discussion hub (announcements, vendor disputes, market-status tracking after seizures) — useful for understanding how "migration after takedown" actually gets announced/discussed, which is precisely the rebrand-detection signal Pillar 3 targets |
| **LeakBase, BHF-style boards** | Research public reporting on their typical listing format for breach data — relevant to your data model's "category" and "listing type" fields, less relevant to the AI/stylometry pillar |

---

## 4. Prior Art at the "Whole System" Level (what's already been built)

Look at these before designing your architecture, so you're extending known approaches, not reinventing:

- **DARPA Memex program** — the most directly analogous prior effort (2014–2017), specifically built for deep/dark web indexing and human-trafficking-focused deanonymization for law enforcement. Search for public Memex program papers/summaries — several components were open-sourced.
- **Commercial threat-intel platforms**: **Recorded Future**, **DarkOwl Vision**, **Flashpoint**, **Searchlight Cyber (formerly Dark Search)** — these are literally commercial versions of exactly this problem statement. You obviously can't access their internals, but their **public product pages, whitepapers, and case study PDFs** describe capability categories (actor profiling, marketplace monitoring, alerting) — useful for shaping your dashboard's feature list and terminology to sound credible to judges who may know these products exist.
- **Academic papers**: search Google Scholar for "Tor hidden service deanonymization," "dark web vendor fingerprinting," "cross-marketplace vendor migration detection" — there's a real body of published research (e.g., work correlating vendor writing style across AlphaBay/Silk Road/Hansa after seizures) you can cite directly in your report and borrow methodology from.

- **Verified prior art — Polito & Marra, "Argus: A Platform for Multi-source Cyber Threat Intelligence Collection and Analysis"** (Master's thesis, AY 2025–2026, advisor Prof. Michele Carminati). This is a **real, legitimate thesis** — not to be confused with an earlier, unverified GitHub repo also called "Argus" that was claimed (by an AI research pass) to already implement our full 3-pillar spec; that specific repo/claim could not be confirmed to exist as described and should be treated as likely fabricated. This thesis is a different, real, and genuinely useful source, though it solves a **different, adjacent problem**: general CTI collection + source-quality comparison (timeliness/exclusivity/overlap) across feeds, vendor reports, Telegram, Discord, forums, and dark web leak sites — using NER + classification. Its "Attribution" concept means linking an attack *event* to an *already-named* APT group via entity co-occurrence, **not** deanonymizing an anonymous persona's real identity — so it does not cover any of our 3 pillars directly, but its collection-layer engineering is directly reusable:
  - **Container-level Tor isolation** — proxy env vars set at the Docker container level (via a Privoxy sidecar → Tor daemon) rather than per-request in application code, reducing leak risk versus the approach we discussed earlier.
  - **Dynamic `.onion` discovery** — spiders resolve current-verified addresses from a trusted directory (e.g. `onion.live`) before each run, rather than relying on static URL lists that go stale.
  - **Incremental crawl state** via local SQLite (tracks last-seen IDs, avoids re-scraping).
  - **Deliberately unprocessed raw storage for dark web text** — they avoid aggressive cleaning of dark web content specifically because "noisy artifacts may carry intelligence value," which is directly relevant justification for preserving raw text for our stylometry pillar.
  - **Citable ethical framework**: passive/read-only collection, no purchasing/interacting with illicit markets, rate-limited, and **explicitly text-only — no images or attachments** to avoid ingesting illegal/disturbing content. Worth adopting near-verbatim for our own methodology section, with citation.
  - Their own Limitations chapter explicitly states they do **not** attempt multimodal analysis, cross-source entity resolution, or stylometric linking — confirming this is exactly the gap our submission fills.

- **Law enforcement case studies (public record)**: the actual **Silk Road (Ross Ulbricht)**, **AlphaBay (Alexandre Cazes)**, and **Hansa Market** takedowns are publicly documented via court filings/DOJ press releases, and describe *which specific OPSEC mistakes* led to deanonymization (e.g., Ulbricht's early forum posts under a real-name-linked handle before he adopted "Dread Pirate Roberts"; AlphaBay's welcome email leaking Cazes' real email address in server misconfig). These are excellent, citable, entirely public real-world examples of exactly the "misconfiguration" and "identity-reuse" logic your Pillars 1 and 2 are built on.

**Research task:** One person builds a slide/page of "3 real deanonymization case studies + exactly what technical mistake caused it" — this becomes great material both for your architecture justification and for your final presentation to judges.

---

## 5. What Parameters Can Actually Be Extracted From a `.onion` Site? (the actual checklist)

This is the concrete "what does our extractor pull out of a page" list — organize your data model around this:

**Infrastructure-layer (Pillar 1):**
- HTTP response headers (Server, X-Powered-By, custom headers)
- TLS certificate (if HTTPS-over-onion is used — subject, issuer, SANs, serial number, validity dates) → checked against Certificate Transparency logs for clearnet reuse
- Favicon hash (a classic OSINT trick — identical favicon hash across an onion and a clearnet IP is a strong signal; Shodan indexes favicon hashes for exactly this reason)
- robots.txt content and structure
- Default/error page banners (Apache default page, Nginx welcome page, phpinfo() leakage)
- Server-status / server-info pages if exposed
- Hidden service descriptor metadata (version, introduction point count, publish timestamps — inconsistent publishing patterns can suggest load-balanced or misconfigured multi-server setups)
- SSH host key fingerprint (if somehow exposed/reachable — rare but OnionScan checks for this)

**Entity/graph layer (Pillar 2):**
- Vendor/user handle (exact string + normalized/fuzzy variants)
- PGP public key block + fingerprint
- Cryptocurrency wallet addresses mentioned in listings/profiles
- Vouches, referral codes, "also selling on" mentions
- Forum signature blocks, contact info (Jabber/XMPP IDs, Session IDs, Wickr usernames — common in these communities)
- Listing categories, pricing patterns, shipping-origin claims
- Account creation date, post count, reputation/trust score shown on-platform

**Behavioral/stylometric layer (Pillar 3):**
- Raw post/listing text corpus per persona
- Posting timestamps (for time-zone inference via activity histograms)
- Language, dialect markers, systematic spelling/grammar patterns
- Image metadata where present (EXIF is usually stripped by savvy actors, but check anyway — many aren't careful)
- Formatting habits (markdown use, emoji use, characteristic phrases/catchphrases)

---

## 6. What Should You Actually Point the Crawler At?

Reconfirming from earlier, now as a concrete target list to research/build:

1. **Your own self-hosted `.onion` test service(s)** with deliberately injected misconfigs (matching cert to a clearnet box you control, exposed status page, reused favicon) — build 2–3 of these to prove Pillar 1 detection works, with full ground truth.
2. **Academic corpora replayed locally** (CrimeBB, Gwern's archived marketplace dumps) — you're not "crawling" a live target, you're running your extractor against static archived HTML/text, which is 100% safe and still demonstrates the same code path.
3. **A small number of known-benign real `.onion` sites** (Tor Project's own site, ProPublica's onion mirror, ahmia.fi's own onion mirror) — purely to prove your crawler traverses the real Tor network end-to-end, not just localhost.
4. **Synthetic personas** you generate to inject known cross-links (same PGP key under two handles, same stylistic fingerprint) for Pillar 3's verifiable demo.

Do **not** add live active-marketplace crawling to this list — not because of squeamishness, but because it adds legal/security risk to your team for zero net improvement in what you can actually prove to judges (you can't verify "ground truth" on a real anonymous vendor anyway, so a real-market demo is actually *less* convincing than a synthetic one with provable planted answers).

---

## Suggested Division of Labor

| Owner | Research Area |
|---|---|
| Person A | Tor internals + Stem + torrc setup + Whonix/Tails environment build; test Playwright-inside-Whonix-Workstation performance |
| Person B | OnionScan deep-read + Shodan/Censys/ZoomEye API comparison (favicon hash + cert search) + crt.sh scripted queries + SecurityTrails passive DNS |
| Person C | Academic datasets (CrimeBB, Gwern archives) — access, licensing, format; plus TorBot/OnionSearch/thedevilseye crawl-method comparison |
| Person D | Graph DB (Neo4j vs NetworkX/Postgres) + Maltego Transform architecture + Lampyre wallet-clustering features |
| Person E | Stylometry methods (sklearn baseline vs SBERT embeddings) + PGP libraries |
| Person F | Prior art case studies (Silk Road/AlphaBay/Hansa mistakes) + ShadowDragon/commercial product feature surveys (for dashboard/report design language) + threat-intel reporting on XSS/Exploit.in/Dread/LeakBase forum structure |
| Person G | SpiderFoot backbone evaluation (custom module API, storage model, HX vs OSS) + Sherlock/Holehe/h8mail/Ignorant/Epieos/Intelligence X — confirm programmatic (library/API) usability of each, not just CLI/UI |
| Person H | Run the **"Prebuilt Repo Hunt"** task (see separate brief) — find additional open-source GitHub repos covering any slice of Pillars 1–3 or the dashboard/export layer, beyond what's already listed above |

Reconvene once everyone has notes, and we'll turn this into the actual data model + architecture + build order.
