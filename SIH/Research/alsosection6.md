Based on my research, here are the four sections you requested:

## 1. STIX 2.1 as a Data Model Foundation

**What it is:** STIX 2.1 (Structured Threat Information eXpression) is an OASIS-standardized JSON-based language for representing cyber threat intelligence.  It defines 18 STIX Domain Objects (SDOs) that cover both high-level entities and operational elements. [arxiv](https://arxiv.org/html/2512.12078v1)

**Core object types relevant to your use case:** [arxiv](https://arxiv.org/html/2512.12078v1)

- **Threat-Actor** — Represents individuals or groups operating with malicious intent (includes properties like `sophistication`, `resource_level`, `primary_motivation`)
- **Indicator** — Contains a detection pattern (e.g., IP, domain, hash, YARA rule) with a `confidence` field and validity window
- **Identity** — Represents organizations, individuals, or systems (useful for storing handles, PGP key owners, wallet owners)
- **Infrastructure** — Command-and-control servers, staging hosts, hidden services
- **Malware** / **Tool** — Software used in attacks
- **Attack-Pattern** — Specific TTPs, typically referenced by MITRE ATT&CK technique ID
- **Campaign** / **Intrusion-Set** — Grouped activity attributed to an actor
- **Relationship** — Links objects together (e.g., `attributed-to`, `indicates`, `uses`, `targets`, `communicates-with`) [ip-reputation.raffapi](https://ip-reputation.raffapi.com/blog/stix-2-1-feed-integration-guide)
- **Report** / **Note** / **Opinion** — Analyst commentary and assessments
- **Observed-Data** — Raw technical information (SCOs like IP addresses, domains, file hashes) [deepwiki](https://deepwiki.com/oasis-open/tac-ontology/2.2-stix-domain-objects-(sdos))

**Adaptation for your dashboard:** OpenCTI implements STIX 2.1 with extensions, organizing all data into SDOs (domain objects), SCOs (cyber observables), SROs (relationship objects), and meta objects (markings, labels).  You could adopt a simplified subset: [deepwiki](https://deepwiki.com/OpenCTI-Platform/opencti/4-stix-data-model)

- Map your **actor profiles** to `Threat-Actor` SDOs
- Map **identifiers** (handles, PGP keys, wallets) to `Identity` or custom SCOs
- Map **hidden service indicators** to `Infrastructure` or `Indicator` objects
- Use `Relationship` objects for persona linkages with a `confidence` property (STIX includes a standard 0–100 confidence field)
- Store `last-scan date` in the `modified` timestamp field
- Store `source` in the `created_by_ref` (Identity) or via `external_references`

You do not need full STIX/TAXII compliance; using the object types and relationship model as a schema blueprint is sufficient. [docs.ellio](https://docs.ellio.tech/threat-intel/integrations/microsoft-sentinel-taxii/stix-data-model)

***

## 2. Confidence Scoring in OpenCTI, MISP, Maltego

**OpenCTI:** Built on STIX 2.1, OpenCTI includes a `confidence` field (0–100) on SDOs and relationships.  The platform uses deterministic identifier generation and validates relationships against a mapping table (`stixCoreRelationshipsMapping`) that defines allowed relationship types (e.g., `attributed-to`, `indicates`).  However, I did **not** find a source explicitly stating OpenCTI's algorithm for computing confidence scores on inferred relationships—this appears to be analyst-assigned or source-derived rather than auto-computed via probabilistic fusion. [deepwiki](https://deepwiki.com/OpenCTI-Platform/opencti/4-stix-data-model)

**MISP:** MISP is a community-driven threat intelligence sharing platform containing structured feeds of IOCs.  Sources mention "Source Reliability Scoring" and "Evidence Weighting" evaluated via ROC-AUC for binary credibility (reliable vs. suspect).  However, I did **not** find explicit documentation that MISP uses Noisy-OR or other named probabilistic fusion methods for relationship confidence. The correlation rules in MISP are typically deterministic (matching attributes), with confidence derived from source reliability and sighting frequency. [arxiv](https://arxiv.org/html/2509.23573v1)

**Maltego:** Maltego is a visual link analysis tool for OSINT that transforms entities (domains, IPs, emails) into interactive graphs.  Sources emphasize that "correlation is not proof" and analysts must verify source, timestamp, second-source confirmation, and manual validation before reporting findings.  One MCP (Model Context Protocol) integration exposes a `maltego_score_entity` tool that returns "confidence, source reliability, linkage strength, priority, novelty for one entity."  However, I did **not** find a public formula for how Maltego computes these scores—they appear to be transform-specific and provider-dependent. [hackita](https://hackita.it/articoli/maltego/)

**Commonly used approaches in the field (not attributed to specific platforms without evidence):**

- **Weighted scoring:** Assign weights to evidence types (e.g., infrastructure overlap = 40%, TTP overlap = 35%, temporal proximity = 15%, victimology = 10%), then sum to produce a 0–100 score with thresholds for HIGH/MEDIUM/LOW. [getclaudeskills](https://www.getclaudeskills.com/skills/correlating-threat-campaigns-mukul975)
- **Probability-anchored likelihood:** Use ICD-203 analytic standards with likelihood terms ("almost no chance" → "almost certain") reported alongside evidence confidence bands. [github](https://github.com/7onez/cti-expert)
- **Source reliability × malicious weight:** For each enrichment source, compute `weighted_score += confidence × source_score`, then normalize to 0–100. [culpur](https://culpur.net/2026/03/31/building-osint-automation-pipelines-for-threat-research-and-incident-response/)
- **Log-odds fusion (Bayesian):** Transform scores to logit space, apply `log_odds_conjunction` with optional per-signal reliability weights (∑wᵢ = 1).  This is described in a signal-fusion library but **not** explicitly attributed to OpenCTI/MISP/Maltego. [deepwiki](https://deepwiki.com/cognica-io/bayesian-bm25/4-signal-fusion)

**Recommendation:** For your hackathon system, use a transparent weighted scoring model (like the 40/35/15/10 example) and expose the component scores in your UI so analysts can see which signals drove the attribution. [getclaudeskills](https://www.getclaudeskills.com/skills/correlating-threat-campaigns-mukul975)

***

## 3. Open-Source Graph Visualization Libraries for Web Dashboards

| Library | License | Rendering | Best For | Tradeoffs | Source |
|---|---|---|---|---|---|
| **Cytoscape.js** | MIT | Canvas | Graph analysis with algorithms (shortest path, centrality, BFS/DFS), multiple layouts (force-directed, hierarchical, circular), rich styling | Large animated layouts can block the main thread; documentation gaps for advanced topics |  [github](https://github.com/i2mint/ij/discussions/1) |
| **vis-network** (part of vis.js) | Apache-2.0 OR MIT | Canvas | Interactive network diagrams with physics-based layout, drag/drop, clustering, quick editing controls | Physics needs stabilization; limited customization compared to Cytoscape; large bundle size (~180KB) |  [github](https://github.com/i2mint/ij/discussions/1) |
| **Sigma.js** (with graphology) | MIT | WebGL | Large-scale graph rendering (10k+ nodes), knowledge graphs, social graphs | More assembly work for algorithms (relies on graphology ecosystem); custom shapes require WebGL shader work |  [pistack](https://www.pistack.xyz/posts/2026-06-09-self-hosted-graph-network-visualization-cytoscapejs-g6-visnetwork-forcegraph/) |

**Practical 2026 rule:** [pkgpulse](https://www.pkgpulse.com/guides/cytoscape-vs-vis-network-vs-sigma-graph-visualization-2026)
- **Cytoscape.js** — when the graph is an analysis object (algorithms, layouts, centrality matter)
- **vis-network** — when the product is an interactive network diagram (physics, drag/drop, clustering, quick editing)
- **Sigma.js** — when the graph is large enough that WebGL rendering and graphology data layer matter more than built-in algorithms

**React integration:** All three work via refs; `@react-sigma` provides hooks for Sigma.js, and `react-cytoscapejs` wraps Cytoscape.js.  vis-network's DataSet objects are reactive and update automatically on changes. [pkgpulse](https://www.pkgpulse.com/guides/cytoscape-vs-vis-network-vs-sigma-graph-visualization-2026)

***

## 4. CSV/JSON Export Design Best Practices for Intelligence Tools

**STIX 2.1 export format:** STIX defines a standardized JSON-based language for threat intelligence, with objects like `Threat-Actor`, `Identity`, `Intrusion-Set`, `Indicator`, `Infrastructure`, and `Relationship`.  A typical STIX `indicator` object includes: [deepwiki](https://deepwiki.com/oryon-osint/OSINT360-GPT/6.3-threat-intelligence-format-(stix-2.1))

```json
{
  "type": "indicator",
  "spec_version": "2.1",
  "id": "indicator--...",
  "pattern": "[ipv4-addr:value = '1.2.3.4']",
  "pattern_type": "stix",
  "confidence": 75,
  "valid_from": "2026-01-01T00:00:00Z",
  "created_by_ref": "identity--...",
  "external_references": [...]
}
```

**Common fields in investigative/intelligence exports:** [deepwiki](https://deepwiki.com/oryon-osint/OSINT360-GPT/6.3-threat-intelligence-format-(stix-2.1))

- **Entity identifiers:** `id` (UUID/STIX ID), `name`/`handle`, `type` (Threat-Actor, Identity, Indicator, etc.)
- **Confidence/provenance:** `confidence` (0–100 numeric), `source_reliability` (e.g., "A"–"F" scale or 0–1), `evidence_weights` (per-signal breakdown)
- **Timestamps:** `created`, `modified`, `last_seen`/`last-scan date`, `valid_from`/`valid_until`
- **Relationships:** `source_ref`, `target_ref`, `relationship_type` (e.g., `attributed-to`, `indicates`), `confidence` on the relationship itself
- **Category/tags:** `labels`, `kill_chain_phases`, `attack_pattern` (MITRE ATT&CK IDs), `primary_motivation`, `sophistication`
- **Source attribution:** `created_by_ref` (Identity object), `external_references` (URLs, report IDs), `object_marking_ref` (TLP marking)
- **Export metadata:** `export_timestamp`, `export_format` (STIX 2.1, CSV, JSON), `export_version`

**CSV design:** For CSV exports, typical columns include: [culpur](https://culpur.net/2026/03/31/building-osint-automation-pipelines-for-threat-research-and-incident-response/)

- `entity_id`, `entity_type`, `name`, `confidence_score`, `category`, `last_scan_date`, `source`, `relationship_type`, `related_entity_id`, `evidence_breakdown` (JSON string or semicolon-delimited weights)

**Confidence representation:** Vendors with opaque or manually assigned confidence scores provide less actionable enrichment than those with machine-calculated scores based on source reliability, indicator age, and sighting frequency.  Best practice is to return confidence as **numeric values** (0–100 or 0.0–1.0) in API responses and exports, not just categorical labels (HIGH/MEDIUM/LOW). [decryptiondigest](https://www.decryptiondigest.com/blog/threat-intelligence-platform-soar-integration)

**Provenance tracking:** Include `source_reliability` and `evidence_weights` fields so analysts can audit why a score was assigned.  For example: [arxiv](https://arxiv.org/html/2509.23573v1)

```json
{
  "confidence": 78,
  "evidence_weights": {
    "infrastructure_overlap": 40,
    "capability_overlap": 35,
    "temporal_proximity": 15,
    "victimology_alignment": 10
  },
  "source_reliability": 0.9,
  "created_by": "analyst--alice",
  "external_references": [{"url": "https://crt.sh/?q=example.com"}]
}
```



**STIX bundle export:** For interoperability, consider offering a STIX 2.1 Bundle export containing all entities and relationships as SDOs/SROs—this allows ingestion into OpenCTI, MISP, or other STIX-capable platforms. [deepwiki](https://deepwiki.com/oasis-open/tac-ontology/2.4-stix-relationship-objects-(sros)-and-bundle)

***

All tools, libraries, and platforms mentioned above were found in live search results or fetched pages. I explicitly flagged where I could not confirm specific algorithms (e.g., OpenCTI/MISP/Maltego confidence computation methods) rather than attributing formulas without evidence.